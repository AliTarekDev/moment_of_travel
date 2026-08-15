CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'reception', 'accountant');
CREATE TYPE service_type_enum AS ENUM ('flight', 'hotel', 'tour', 'cruise', 'car', 'private_aviation');
CREATE TYPE booking_status_enum AS ENUM ('new', 'reviewing', 'quoted', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'pending', 'partially_paid', 'paid', 'refunded');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "fullName" varchar(120) NOT NULL,
  email varchar(180) NOT NULL UNIQUE,
  "passwordHash" varchar NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'reception',
  active boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference varchar(30) NOT NULL UNIQUE,
  "customerName" varchar(120) NOT NULL,
  "customerEmail" varchar(180) NOT NULL,
  "customerPhone" varchar(40) NOT NULL,
  "serviceType" service_type_enum NOT NULL,
  destination varchar(140) NOT NULL,
  "departureDate" date,
  travelers smallint NOT NULL DEFAULT 1 CHECK (travelers BETWEEN 1 AND 50),
  "customerNotes" text,
  "internalNotes" text,
  status booking_status_enum NOT NULL DEFAULT 'new',
  "paymentStatus" payment_status_enum NOT NULL DEFAULT 'unpaid',
  "totalAmount" numeric(12, 2) CHECK ("totalAmount" >= 0),
  currency varchar(3) NOT NULL DEFAULT 'EGP',
  "assignedToId" uuid REFERENCES users(id) ON DELETE SET NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX bookings_status_idx ON bookings(status);
CREATE INDEX bookings_payment_status_idx ON bookings("paymentStatus");
CREATE INDEX bookings_created_at_idx ON bookings("createdAt" DESC);
CREATE INDEX bookings_assigned_to_idx ON bookings("assignedToId");
