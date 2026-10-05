BEGIN;
ALTER TABLE catalog_items ADD COLUMN IF NOT EXISTS "durationDays" smallint;
ALTER TABLE catalog_items ADD COLUMN IF NOT EXISTS itinerary jsonb NOT NULL DEFAULT '[]'::jsonb;
COMMIT;
