CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "fullName" varchar(160) NOT NULL,
  mobile varchar(40) NOT NULL,
  whatsapp varchar(40),
  email varchar(180),
  nationality varchar(2) NOT NULL,
  "birthDate" date NOT NULL,
  gender varchar(10) NOT NULL CHECK (gender IN ('male','female')),
  "maritalStatus" varchar(15) NOT NULL CHECK ("maritalStatus" IN ('single','married','divorced','widowed')),
  "mahramName" varchar(160),
  "mahramRelationship" varchar(100),
  notes text,
  "nationalId" varchar(30) UNIQUE,
  "passportNumber" varchar(30) UNIQUE,
  "passportExpiry" date,
  "passportImageName" varchar(120), "passportImageMime" varchar(80), "passportImageData" bytea,
  "nationalIdImageName" varchar(120), "nationalIdImageMime" varchar(80), "nationalIdImageData" bytea,
  "portraitImageName" varchar(120), "portraitImageMime" varchar(80), "portraitImageData" bytea,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS clients_name_idx ON clients ("fullName");
CREATE INDEX IF NOT EXISTS clients_mobile_idx ON clients (mobile);
