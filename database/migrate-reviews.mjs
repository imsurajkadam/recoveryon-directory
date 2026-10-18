import { getDatabase } from "../src/lib/db.mjs";
const sql = getDatabase();
await sql`
  create table if not exists reviews (
    id uuid primary key default gen_random_uuid(),
    provider_id uuid not null references providers(id) on delete cascade,
    reviewer_name text not null,
    reviewer_role text not null default 'former_client'
      check (reviewer_role in ('former_client', 'family_member', 'other')),
    rating integer not null check (rating >= 1 and rating <= 5),
    title text,
    body text not null,
    status text not null default 'pending'
      check (status in ('pending', 'approved', 'rejected')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )
`;
await sql`create index if not exists reviews_provider_id_idx on reviews(provider_id)`;
await sql`create index if not exists reviews_status_idx on reviews(status)`;
console.log("reviews table created");
