const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_zGEICiZt6j8f@ep-restless-butterfly-ay022d4w-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require' });
pool.query('SELECT 1 as x').then(res => {
  console.log("Connected successfully", res.rows);
  process.exit(0);
}).catch(err => {
  console.error("Connection failed", err);
  process.exit(1);
});
