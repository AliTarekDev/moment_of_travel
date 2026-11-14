const { Client } = require('pg');
const { createHash } = require('node:crypto');
const { readdir, readFile } = require('node:fs/promises');
const path = require('node:path');

async function migrate() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set before running migrations');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });
  await client.connect();
  try {
    // Serialize startup migrations when deployments overlap.
    await client.query('SELECT pg_advisory_lock(148527, 1)');
    await client.query(`CREATE TABLE IF NOT EXISTS app_schema_migrations (
      name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now()
    )`);
    const directory = path.resolve(__dirname, '../database');
    const files = (await readdir(directory)).filter(name => /^\d+_.*\.sql$/.test(name)).sort();
    for (const name of files) {
      const source = await readFile(path.join(directory, name), 'utf8');
      const checksum = createHash('sha256').update(source.replace(/\r\n/g, '\n')).digest('hex');
      const { rows } = await client.query('SELECT checksum FROM app_schema_migrations WHERE name = $1', [name]);
      if (rows.length) {
        if (rows[0].checksum !== checksum) throw new Error(`Previously applied migration changed: ${name}`);
        continue;
      }
      // 007 has an outer transaction; the runner owns that transaction instead.
      const sql = source.replace(/^\s*BEGIN\s*;/i, '').replace(/COMMIT\s*;\s*$/i, '');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO app_schema_migrations (name, checksum) VALUES ($1, $2)', [name, checksum]);
        await client.query('COMMIT');
        console.log(`Applied ${name}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    await client.end();
  }
}

migrate().catch(error => {
  // Do not log the database connection string or other credentials.
  console.error(`Database migration failed: ${error.message}`);
  process.exitCode = 1;
});
