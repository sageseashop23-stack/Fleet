const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_zGEICiZt6j8f@ep-restless-butterfly-ay022d4w-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require' });
async function run() {
  const { rows } = await pool.query('SELECT data FROM app_state WHERE id = 1');
  console.log("DB size:", JSON.stringify(rows[0].data).length);
}
run().then(() => process.exit(0)).catch(console.error);
