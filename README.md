# Moment of Travel

Moment of Travel is a three-process TypeScript application:

- `website` — public Angular website with SSR and travel/private-aviation request forms.
- `dashboard` — Angular staff operations dashboard.
- `api` — NestJS REST API backed by PostgreSQL.

The current workflow is a **staff-reviewed booking request**. It does not claim live flight/hotel inventory, instant confirmation, payment processing, or email delivery.

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

Apply every SQL file in `apps/api/database` in numeric order, including `005_programs.sql` followed by `006_optional_program_fields.sql`, and set:

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
- Microsoft 365/email delivery is not implemented. Add a provider module with verified SPF, DKIM, and DMARC before promising automatic email.
- Flight, hotel, and tour inventory is presentation content, not live provider data.
- Catalog images currently use persistent HTTPS URLs. Connect Cloudinary or S3 before adding direct image uploads; Render's service filesystem is ephemeral.
- Client identity attachments are private authenticated resources stored in PostgreSQL with a 5 MB per-image limit. For higher volume, migrate these blobs to encrypted private object storage and add audit logging before broadening staff access.
- Add rate limiting/CAPTCHA to public forms before a public launch.
- Confirm all business claims, phone numbers, email addresses, prices, accreditations, and legal copy with the client.
- Add audit-log persistence before using the dashboard for regulated financial approvals.
