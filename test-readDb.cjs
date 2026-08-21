const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_zGEICiZt6j8f@ep-restless-butterfly-ay022d4w-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require' });
async function run() {
  const { rowCount } = await pool.query('SELECT id FROM app_state WHERE id = 1');
  console.log("RowCount:", rowCount);
  if (rowCount === 0) {
    console.log("Empty!");
  } else {
    const { rows } = await pool.query('SELECT data FROM app_state WHERE id = 1');
    console.log("Rows length:", rows.length);
  }
}
run().then(() => process.exit(0)).catch(console.error);
