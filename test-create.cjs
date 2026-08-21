const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_zGEICiZt6j8f@ep-restless-butterfly-ay022d4w-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require' });
async function run() {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS app_state (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL
      )
  `);
  console.log("Created table");
  const { rowCount } = await pool.query('SELECT id FROM app_state WHERE id = 1');
  console.log("RowCount:", rowCount);
  if (rowCount === 0) {
    await pool.query("INSERT INTO app_state (id, data) VALUES (1, '{}'::jsonb)");
  }
}
run().then(() => process.exit(0)).catch(console.error);
