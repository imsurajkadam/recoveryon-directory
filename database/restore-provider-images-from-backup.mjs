import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const inputArg = args.find((value) => value.startsWith("--input="));
if (!inputArg) throw new Error("Provide --input=work/image-migrations/<rollback-file>.json");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");

const inputPath = resolve(process.cwd(), inputArg.split("=").slice(1).join("="));
const backup = JSON.parse(await readFile(inputPath, "utf8"));
if (!Array.isArray(backup.providers)) throw new Error("The rollback file does not contain a providers array");

console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  inputPath,
  providers: backup.providers.length,
  createdAt: backup.createdAt || null,
}, null, 2));

if (!apply) {
  console.log("Dry run only. Use --apply to restore the saved provider image fields.");
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL);
let restored = 0;
for (const provider of backup.providers) {
  const result = await sql.query(`
    update providers
    set featured_image_url = $1,
        image_urls = $2::text[],
        updated_at = now()
    where id = $3::uuid
    returning id
  `, [provider.featuredImageUrl, provider.imageUrls || [], provider.id]);
  restored += result.length;
}

console.log(JSON.stringify({ restoredProviders: restored }, null, 2));
