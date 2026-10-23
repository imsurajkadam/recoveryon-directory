import { createDatabaseClient } from "./client.mjs";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");

const sql = createDatabaseClient();
const columns = await sql.unsafe(
  `select table_name, column_name, data_type, udt_name
   from information_schema.columns
   where table_schema = 'public'
     and (data_type in ('text', 'character varying', 'jsonb') or udt_name = '_text')
   order by table_name, ordinal_position`,
);
const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
let changedRows = 0;

for (const column of columns) {
  const table = quote(column.table_name);
  const field = quote(column.column_name);
  let statement;
  if (column.udt_name === "_text") {
    statement = `update ${table} set ${field} = array(
      select replace(value, chr(8212), '-') from unnest(${field}) value
    ) where strpos(array_to_string(${field}, ''), chr(8212)) > 0`;
  } else if (column.data_type === "jsonb") {
    statement = `update ${table} set ${field} = replace(${field}::text, chr(8212), '-')::jsonb
      where strpos(${field}::text, chr(8212)) > 0`;
  } else {
    statement = `update ${table} set ${field} = replace(${field}, chr(8212), '-')
      where strpos(${field}, chr(8212)) > 0`;
  }
  const result = await sql.unsafe(statement);
  changedRows += Number(result.count || 0);
}

const remaining = await sql.unsafe(
  `select table_name from information_schema.tables
   where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name`,
);
let remainingRows = 0;
for (const row of remaining) {
  const table = quote(row.table_name);
  const result = await sql.unsafe(`select count(*)::int as count from ${table} value where strpos(row_to_json(value)::text, chr(8212)) > 0`);
  remainingRows += Number(result[0]?.count || 0);
}

console.log(JSON.stringify({ changedRows, remainingRows }, null, 2));
if (remainingRows) process.exit(1);
await sql.end();
