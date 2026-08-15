CREATE TABLE IF NOT EXISTS catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(180) NOT NULL UNIQUE,
  division varchar(20) NOT NULL CHECK (division IN ('travel', 'aviation')),
  type varchar(24) NOT NULL CHECK (type IN ('trip', 'offer', 'destination', 'hotel', 'flight', 'service')),
  status varchar(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  "titleAr" varchar(180) NOT NULL,
  "titleEn" varchar(180) NOT NULL,
  "summaryAr" text NOT NULL,
  "summaryEn" text NOT NULL,
  "descriptionAr" text,
  "descriptionEn" text,
  "locationAr" varchar(180),
  "locationEn" varchar(180),
  "imageUrl" text,
  price decimal(12,2),
  currency varchar(3) NOT NULL DEFAULT 'SAR',
  "startDate" date,
  "endDate" date,
  featured boolean NOT NULL DEFAULT false,
  "sortOrder" integer NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT catalog_items_date_range CHECK ("endDate" IS NULL OR "startDate" IS NULL OR "endDate" >= "startDate")
);

CREATE INDEX IF NOT EXISTS catalog_items_public_order_idx
  ON catalog_items (status, division, "sortOrder");
