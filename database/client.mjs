import postgres from "postgres";

export function createDatabaseClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return postgres(process.env.DATABASE_URL, {
    max: 5,
    prepare: false,
    connect_timeout: 15,
    idle_timeout: 20,
  });
}
