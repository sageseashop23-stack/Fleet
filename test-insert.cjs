const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_zGEICiZt6j8f@ep-restless-butterfly-ay022d4w-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require' });
async function run() {
  const data = JSON.parse(fs.readFileSync('local_db.json', 'utf-8'));
  console.log("Parsed local_db.json, size:", JSON.stringify(data).length);
  await pool.query('UPDATE app_state SET data = $1 WHERE id = 1', [JSON.stringify(data)]);
  console.log("Updated!");
}
run().then(() => process.exit(0)).catch(console.error);
