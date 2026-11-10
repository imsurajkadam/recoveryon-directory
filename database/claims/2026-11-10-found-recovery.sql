-- Provider claim: Found Recovery, Agoura Hills, CA
-- Claimed by Madison Mastera (Found Recovery) via email, confirmed 2026-11-10.
-- Confirmed details: phone (805) 624-3373; address 27489 Agoura Rd Ste 205, Agoura Hills, CA.

begin;

-- 1. Check: this should return exactly ONE row (the Agoura Hills location).
select id, name, organization_slug, location_slug, address, city, state, postal_code, phone, verification_status
from providers
where organization_slug = 'found-recovery'
  and city ilike 'Agoura Hills'
  and publication_status = 'published';

-- 2. Apply the provider-confirmed details and mark the listing as claimed.
update providers
set phone = '+1 (805) 624-3373',
    address = '27489 Agoura Rd, Suite 205',
    verification_status = 'provider-confirmed',
    last_verified_at = now(),
    updated_at = now()
where organization_slug = 'found-recovery'
  and city ilike 'Agoura Hills'
  and publication_status = 'published'
returning id, name, address, city, state, postal_code, phone, verification_status, last_verified_at;

-- 3. Audit trail: record how the claim was confirmed.
insert into provider_verification_checks (provider_id, check_type, status, evidence)
select id, 'provider-claim', 'pass',
       jsonb_build_object(
         'method', 'email',
         'claimed_by', 'Madison Mastera',
         'confirmed_phone', '+1 (805) 624-3373',
         'confirmed_address', '27489 Agoura Rd, Suite 205, Agoura Hills, CA',
         'confirmed_on', '2026-11-10'
       )
from providers
where organization_slug = 'found-recovery'
  and city ilike 'Agoura Hills'
  and publication_status = 'published';

-- If step 2 updated exactly one row, run: commit;
-- Otherwise run: rollback;
