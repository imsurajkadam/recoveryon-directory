// Applies the recovered organization names and slugs from
// database/slug-name-fixes.csv to the providers table.
//
//   node database/migrate-slug-name-fixes.mjs            (dry run, default)
//   node database/migrate-slug-name-fixes.mjs --commit   (applies the change)
//
// Each recovered org gets one UPDATE: organization_slug moves from the
// truncated slug to the recovered full slug, and name moves from the stored
// truncated name to the recovered full name, but only on rows whose name
// still matches the stored name, so location-specific name variants are
// left alone. The provider `slug` (legacy name-city-state slug) is never
// touched, so old provider URLs keep working through the legacy lookup.
//
// Clash rule: a new slug that already exists in the database is a clash and
// the mapping is skipped, UNLESS that slug is itself one of the old slugs
// being migrated in this run. That exception is what lets the three
// same-org merges work (two truncations of one org name mapping to one new
// slug, for example Arab Community Center, Centerpointe Sarasota, and the
// Human Resources Center of Edgar and Clark Counties). The existence check
// runs once up front, before any update, so the first half of a merge never
// blocks the second half.
//
// All updates run in a single transaction. Dry runs print the plan and the
// exact SQL without touching the database. DATABASE_URL must be set; the
// script never invents a connection string.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = resolve(root, process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "database/slug-name-fixes.csv");
const commit = process.argv.includes("--commit");

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; }
        else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""])));
}

// Builds the migration plan from CSV rows and the set of organization slugs
// already in the database. Returns one statement per recovered org plus a
// report of what was skipped and why. Pure: no database access here, so the
// plan (and its SQL) can be tested without a live connection.
export function buildPlan(rows, existingSlugs) {
  const recovered = rows.filter((row) => row.status === "recovered" && row.old_org_slug && row.new_org_slug && row.old_org_slug !== row.new_org_slug);
  const migratingOldSlugs = new Set(recovered.map((row) => row.old_org_slug));
  const statements = [];
  const skipped = [];
  for (const row of recovered) {
    if (existingSlugs.has(row.new_org_slug) && !migratingOldSlugs.has(row.new_org_slug)) {
      skipped.push({ oldSlug: row.old_org_slug, newSlug: row.new_org_slug, reason: "clash: new slug already used by a different organization" });
      continue;
    }
    statements.push({
      oldSlug: row.old_org_slug,
      newSlug: row.new_org_slug,
      storedName: row.stored_name,
      recoveredName: row.recovered_full_name,
      text: "update providers set organization_slug = $1, name = case when name = $2 then $3 else name end where organization_slug = $4",
      params: [row.new_org_slug, row.stored_name, row.recovered_full_name, row.old_org_slug],
    });
  }
  return { statements, skipped, recoveredCount: recovered.length };
}

async function main() {
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  // Loaded lazily so the pure plan builder can be imported (and its SQL
  // tested) without a database driver installed.
  const { createDatabaseClient } = await import("./client.mjs");
  const sql = createDatabaseClient();
  try {
    const existing = await sql`select distinct organization_slug from providers where organization_slug is not null`;
    const existingSlugs = new Set(existing.map((row) => row.organization_slug));
    const { statements, skipped, recoveredCount } = buildPlan(rows, existingSlugs);

    // Classify each skip. A new slug held only by rows already carrying the
    // recovered full name is a duplicate: the full-name page already exists
    // (a second import pass created the same facility under the full name)
    // and the truncated rows are duplicate listings, not a rename target.
    // Moving them would also violate the unique
    // (organization_slug, location_slug) index wherever the two copies
    // share a location. Those need a separate dedup decision, not this
    // migration. A new slug held by rows with a different name is a genuine
    // clash with another organization.
    const recoveredByNewSlug = new Map(
      rows.filter((row) => row.status === "recovered").map((row) => [row.new_org_slug, row.recovered_full_name]),
    );
    const skippedNewSlugs = skipped.map((item) => item.newSlug);
    const holders = skippedNewSlugs.length
      ? await sql`select organization_slug, name from providers where organization_slug = any(${sql.array(skippedNewSlugs)})`
      : [];
    const namesBySlug = new Map();
    for (const holder of holders) {
      const names = namesBySlug.get(holder.organization_slug) || [];
      if (!names.includes(holder.name)) names.push(holder.name);
      namesBySlug.set(holder.organization_slug, names);
    }
    const duplicateSkips = [];
    const clashSkips = [];
    for (const item of skipped) {
      const names = namesBySlug.get(item.newSlug) || [];
      const recoveredName = recoveredByNewSlug.get(item.newSlug);
      if (names.length && names.every((name) => name === recoveredName)) {
        item.reason = "duplicate: full-name page already exists under the new slug; truncated rows are duplicate listings, needs a separate dedup";
        duplicateSkips.push(item);
      } else {
        item.reason = "clash: new slug already used by a different organization";
        clashSkips.push(item);
      }
    }

    const oldSlugs = statements.map((statement) => statement.oldSlug);
    const counts = oldSlugs.length
      ? await sql`select organization_slug, count(*)::int as n from providers where organization_slug = any(${sql.array(oldSlugs)}) group by organization_slug`
      : [];
    const countBySlug = new Map(counts.map((row) => [row.organization_slug, row.n]));
    const missing = statements.filter((statement) => !countBySlug.has(statement.oldSlug));

    console.log(`Slug/name fix migration (${commit ? "COMMIT" : "dry run"})`);
    console.log(`Recovered orgs in CSV: ${recoveredCount}; statements: ${statements.length}; skipped: ${skipped.length} (${duplicateSkips.length} duplicates already present, ${clashSkips.length} true clashes); old slugs missing from DB: ${missing.length}`);
    for (const item of skipped) console.log(`  SKIP ${item.oldSlug} -> ${item.newSlug} (${item.reason})`);
    for (const item of missing) console.log(`  MISSING ${item.oldSlug} (no rows in DB, statement is a no-op)`);
    for (const statement of statements) {
      console.log(`  ${statement.oldSlug} -> ${statement.newSlug} (${countBySlug.get(statement.oldSlug) || 0} rows)`);
    }
    if (!commit) {
      console.log("Dry run only. Re-run with --commit to apply.");
      for (const statement of statements) console.log(`  SQL: ${statement.text} [${statement.params.map((param) => JSON.stringify(param)).join(", ")}]`);
      return;
    }
    const results = await sql.begin(async (trx) => {
      const updated = [];
      for (const statement of statements) {
        const result = await trx.unsafe(statement.text, statement.params);
        updated.push({ oldSlug: statement.oldSlug, newSlug: statement.newSlug, rows: result.count });
      }
      return updated;
    });
    const total = results.reduce((sum, result) => sum + result.rows, 0);
    console.log(`Applied ${results.length} statements in one transaction; ${total} provider rows updated.`);
    for (const result of results) console.log(`  ${result.oldSlug} -> ${result.newSlug}: ${result.rows} rows`);
  } finally {
    await sql.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exit(1); });
}
