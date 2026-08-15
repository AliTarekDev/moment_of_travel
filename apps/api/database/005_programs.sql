CREATE TABLE IF NOT EXISTS programs(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name varchar(180) NOT NULL,type varchar(15) NOT NULL CHECK(type IN('hajj','umrah')),season varchar(100) NOT NULL,
 "serviceLevel" varchar(15) NOT NULL CHECK("serviceLevel" IN('economy','standard','premium','vip')),status varchar(15) NOT NULL DEFAULT 'draft' CHECK(status IN('draft','published','archived')),
 "departureDate" date NOT NULL,"returnDate" date NOT NULL,"ministryPermitNumber" varchar(80),"makkahHotel" varchar(180) NOT NULL,"makkahHotelRating" smallint NOT NULL CHECK("makkahHotelRating" BETWEEN 1 AND 5),"makkahNights" smallint NOT NULL CHECK("makkahNights" BETWEEN 0 AND 90),
 "madinahHotel" varchar(180) NOT NULL,"madinahHotelRating" smallint NOT NULL CHECK("madinahHotelRating" BETWEEN 1 AND 5),"madinahNights" smallint NOT NULL CHECK("madinahNights" BETWEEN 0 AND 90),airline varchar(160) NOT NULL,"flightNumber" varchar(60) NOT NULL,
 "singlePrice" numeric(12,2) NOT NULL CHECK("singlePrice">=0),"doublePrice" numeric(12,2) NOT NULL CHECK("doublePrice">=0),"triplePrice" numeric(12,2) NOT NULL CHECK("triplePrice">=0),"quadruplePrice" numeric(12,2) NOT NULL CHECK("quadruplePrice">=0),"seatCashCost" numeric(12,2) NOT NULL CHECK("seatCashCost">=0),
 "totalSeats" integer NOT NULL CHECK("totalSeats">0),"includesMeals" boolean NOT NULL DEFAULT false,"includesVisits" boolean NOT NULL DEFAULT false,description text NOT NULL,"seoTitle" varchar(70) NOT NULL,"metaDescription" varchar(180) NOT NULL,"canonicalUrl" text,
 "coverImageName" varchar(120) NOT NULL,"coverImageMime" varchar(80) NOT NULL,"coverImageData" bytea NOT NULL,"socialImageName" varchar(120) NOT NULL,"socialImageMime" varchar(80) NOT NULL,"socialImageData" bytea NOT NULL,
 "createdAt" timestamptz NOT NULL DEFAULT now(),"updatedAt" timestamptz NOT NULL DEFAULT now(),CONSTRAINT programs_date_range CHECK("returnDate">="departureDate")
);
CREATE INDEX IF NOT EXISTS programs_status_date_idx ON programs(status,"departureDate");
