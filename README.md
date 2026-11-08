# Ancient Paths

Ancient Paths is a three-process TypeScript application:

- `website` — public Angular website with SSR and travel/private-aviation request forms.
- `dashboard` — Angular staff operations dashboard.
- `api` — NestJS REST API backed by PostgreSQL.

The current workflow is a **staff-reviewed booking request**. Optional server-side email notifications alert staff after a request is saved. It does not claim live flight/hotel inventory, instant confirmation, or payment processing.

## Prerequisites

- Node.js 22 LTS.
- npm.
- PostgreSQL 17+, installed locally or started with Docker Compose.

## Local setup

Install dependencies:

```powershell
npm.cmd install
```

Start PostgreSQL with Docker:

```powershell
docker compose up -d postgres
```

If PostgreSQL is installed directly on Windows, create a dedicated application user and database in pgAdmin instead:

```sql
CREATE USER dreamstour_app WITH PASSWORD 'replace-with-a-strong-password';
CREATE DATABASE dreamstour OWNER dreamstour_app;
```

Do not run the application with the PostgreSQL `postgres` superuser.

Copy the API environment template and replace every placeholder:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

The Compose development connection string is:

```env
DATABASE_URL=postgresql://dreamstour_app:dreamstour_dev_only@localhost:5432/dreamstour
```

Set `JWT_SECRET` to at least 32 random characters and provide a strong initial administrator password. With `DB_SYNCHRONIZE=true`, TypeORM creates the development schema when the API starts. Never enable synchronization in production.

Run each process in a separate terminal:

```powershell
npm.cmd run start:api
npm.cmd run start:website
npm.cmd run start:dashboard
```

- Website: `http://localhost:4200`
- Dashboard: `http://localhost:4201`
- API health: `http://localhost:3000/api/health`

Both Angular development servers proxy `/api` to port `3000` through `proxy.conf.json`.

## Request email notifications

Standard bookings and tailor-made enquiries send a plain-text staff notification after the database save. The email includes the booking reference, contact and travel details, and full customer notes/questionnaire answers. Replies go to the customer's email address. Email errors do not undo the booking or return a submission error that could cause duplicate requests. Failed messages are logged by reference; there is no automatic retry queue, so staff must follow up from the dashboard.

Add the mail settings from `apps/api/.env.example` to the existing `apps/api/.env` (do not overwrite your database or authentication settings). Defaults are `smtp.gmail.com`, port `587`, mandatory STARTTLS, sender `tali6184@gmail.com`, and recipient `info@ancientpathseg.com`. Credentials belong only in the API environment, never in Angular environment files or source control.

For Gmail, sign into the sender account and enable [2-Step Verification](https://myaccount.google.com/security), then create an [App Password](https://myaccount.google.com/apppasswords) named `Ancient Paths Website`. Put that App Password in `SMTP_PASSWORD` with `SMTP_AUTH=password`. Use the generated App Password, not the normal Google account password. App Password availability depends on the account's security settings; see [Google's instructions](https://support.google.com/accounts/answer/185833).

Microsoft 365 OAuth remains available as an alternative: set `SMTP_HOST=smtp.office365.com`, `SMTP_USER` to the Microsoft mailbox, `SMTP_AUTH=oauth2`, and the three `SMTP_OAUTH_*` values. The administrator must complete [Microsoft's SMTP OAuth setup](https://learn.microsoft.com/en-us/exchange/client-developer/legacy-protocols/how-to-authenticate-an-imap-pop-smtp-application-by-using-oauth#use-client-credentials-grant-flow-to-authenticate-smtp-imap-and-pop-connections).

After configuring authentication, set `MAIL_ENABLED=true` and restart the API. Submit one standard request and one tailor-made enquiry, confirm both appear in the dashboard and the inbox (including junk), and check the API logs for SMTP acceptance or failure. SMTP acceptance does not guarantee inbox delivery. No live message can be tested until credentials are configured.

Run the isolated mail/persistence checks without sending real messages:

```powershell
node --test apps/api/test/booking-notifications.test.cjs
```

## Staff access

On first API startup, `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` create the initial administrator if that email does not exist. Passwords are hashed with bcrypt and the dashboard session is held in an HTTP-only cookie.

Roles:

- `admin` — create staff, manage bookings/payments, publish content, and permanently delete catalog items.
- `manager` — manage bookings/payments, view the team, and create/edit/publish catalog content.
- `reception` — review, assign, quote, and progress bookings.
- `accountant` — view bookings and update payment status.

## API surface

```text
GET    /api/health
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/bookings/public
GET    /api/bookings
GET    /api/bookings/:id
PATCH  /api/bookings/:id
PATCH  /api/bookings/:id/payment
GET    /api/dashboard/summary
GET    /api/users
POST   /api/users
PATCH  /api/users/:id
GET    /api/catalog/public
GET    /api/catalog
GET    /api/catalog/:id
POST   /api/catalog
PATCH  /api/catalog/:id
DELETE /api/catalog/:id
GET    /api/clients
GET    /api/clients/:id
POST   /api/clients/with-attachments
PATCH  /api/clients/:id
DELETE /api/clients/:id
POST   /api/clients/:id/attachments/:kind
GET    /api/clients/:id/attachments/:kind
GET    /api/programs
GET    /api/programs/:id
POST   /api/programs
DELETE /api/programs/:id
GET    /api/programs/:id/images/:kind
```

All routes are authenticated by default except health, login, public booking creation, and the published catalog feed.

## Production database

Apply every SQL file in `apps/api/database` in numeric order, including `007_tour_itineraries.sql` for tour durations and daily descriptions, and set:

```env
NODE_ENV=production
DB_SYNCHRONIZE=false
DB_SSL=true
```

Run schema changes through reviewed migrations and database backups. Do not use the development Compose password in production.

## Lightweight verification

```powershell
npm.cmd run check:api
npm.cmd run check:dashboard
npm.cmd run check:website
```

## Release blockers and deliberate omissions

- Angular 18 currently reports published security advisories. Upgrade Angular as a dedicated task with full regression testing before production deployment.
- Payment gateways are not implemented. Never store card numbers or CVV in this application.
- Request email notifications require server-side SMTP authentication and `MAIL_ENABLED=true`; verify delivery to the configured recipient before launch.
- Flight, hotel, and tour inventory is presentation content, not live provider data.
- Catalog images currently use persistent HTTPS URLs. Connect Cloudinary or S3 before adding direct image uploads; Render's service filesystem is ephemeral.
- Client identity attachments are private authenticated resources stored in PostgreSQL with a 5 MB per-image limit. For higher volume, migrate these blobs to encrypted private object storage and add audit logging before broadening staff access.
- Add rate limiting/CAPTCHA to public forms before a public launch.
- Confirm all business claims, phone numbers, email addresses, prices, accreditations, and legal copy with the client.
- Add audit-log persistence before using the dashboard for regulated financial approvals.

## Tailor-made itinerary enquiries

The website Features menu opens the bilingual tailor-made page and its full-screen Angular Material questionnaire. Answers are held in memory while the website is open; closing and reopening the questionnaire resumes the draft. Reloading the browser clears it.

Deploy the website and API together: `POST /api/bookings/public/tailor-made` validates the full questionnaire and records a new tour enquiry in the existing Bookings inbox. Dates, traveller totals and hotel preference populate the booking fields; all answers are retained in the text notes with readable labels, beyond the ordinary public form's 2,000-character limit. This email-only flow deliberately leaves the phone field empty. No database migration is required.

Pricing, gratuities, hotel inclusion and restricted-site permissions are confirmed in the individual proposal. The page does not assert the reference company's supplier relationships or pricing.
