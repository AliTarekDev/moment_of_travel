# Client test deployment

## Railway trial alternative

Use the repository's `railway.json` for the API service. Create a separate
PostgreSQL service and set DATABASE_URL to its private connection reference.
Use DB_SSL=false for Railway's private Postgres connection, NODE_ENV=production,
DB_SYNCHRONIZE=false, MAIL_ENABLED=false, and RAILPACK_NODE_VERSION=22.
Set JWT_SECRET to a new random secret of at least 32 characters, and supply
ADMIN_EMAIL and a new ADMIN_PASSWORD of at least 12 characters.
Set API_ORIGINS=https://ancientpaths.tali6184.workers.dev.
Generate a public HTTPS domain for the API and use it as the Cloudflare
Worker's API_ORIGIN. Use trial credit only, without upgrading to a paid plan.
The trial ends after 30 days or credit exhaustion; it is not permanent hosting.

## Render alternative

1. Use the root `render.yaml` Blueprint on Render, using a new test database.
2. Supply a test administrator email and a new password of at least 12 characters.
3. Startup applies the numbered SQL migrations once, before starting the API.
   Do not point this initial migration runner at an existing database whose schema
   was created manually or with TypeORM synchronization.
4. Verify the deployed API at `/api/health`.
5. Add `deployment/cloudflare-worker.mjs` to the existing Cloudflare Worker,
   retain its ASSETS binding and single-page-application not-found handling,
   and set API_ORIGIN to the HTTPS origin of the new Render service.
6. Submit a clearly labeled test enquiry through the website and verify persistence.

MAIL_ENABLED is false for initial testing. Email delivery requires separate SMTP
configuration. Free Render services may sleep and free Postgres expires after
30 days. Catalog image uploads on the free API filesystem are temporary; do not
use them as permanent client assets. The website's tour list remains local data.
The staff dashboard is a separate frontend and is not deployed by this Blueprint.
