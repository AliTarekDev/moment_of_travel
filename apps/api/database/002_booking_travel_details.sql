ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS "departureCity" varchar(140),
  ADD COLUMN IF NOT EXISTS "returnDate" date,
  ADD COLUMN IF NOT EXISTS "tripType" varchar(20),
  ADD COLUMN IF NOT EXISTS urgent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "includesTickets" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "includesHotels" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "includesTransport" boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_trip_type_check'
  ) THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_trip_type_check
      CHECK ("tripType" IS NULL OR "tripType" IN ('one_way', 'round_trip'));
  END IF;
END $$;
