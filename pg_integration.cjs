const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// add pg import
code = code.replace(/import express from 'express';/, 'import express from \'express\';\nimport { Pool } from \'pg\';');

// replace readDb and writeDb
const dbLogic = `
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, max: 20 }) : null;

async function ensureTable() {
  if (pool) {
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS app_state (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL
      )
    \`);
    const { rowCount } = await pool.query('SELECT id FROM app_state WHERE id = 1');
    if (rowCount === 0) {
      // Initialize if empty
      const initialData: LocalDb = {
        drivers: [],
        trips: [],
        activityLogs: [],
        gasConfig: { webAppUrl: '', autoSyncOnComplete: true, syncStatus: 'IDLE' }
      };
      // Try to read from local_db.json first
      let data = initialData;
      try {
        if (fs.existsSync(DB_FILE)) {
          data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        }
      } catch (err) {}
      await pool.query('INSERT INTO app_state (id, data) VALUES (1, $1)', [JSON.stringify(data)]);
    }
  }
}

let isTableInitialized = false;

async function readDb(): Promise<LocalDb> {
  if (pool) {
    if (!isTableInitialized) {
      await ensureTable();
      isTableInitialized = true;
    }
    const { rows } = await pool.query('SELECT data FROM app_state WHERE id = 1');
    return rows[0].data;
  }

  // Fallback to local_db.json
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local_db.json:', err);
  }
  return {
    drivers: [],
    trips: [],
    activityLogs: [],
    gasConfig: { webAppUrl: '', autoSyncOnComplete: true, syncStatus: 'IDLE' }
  };
}

async function writeDb(data: LocalDb) {
  if (pool) {
    if (!isTableInitialized) {
      await ensureTable();
      isTableInitialized = true;
    }
    await pool.query('UPDATE app_state SET data = $1 WHERE id = 1', [JSON.stringify(data)]);
    return;
  }

  // Fallback to local_db.json
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local_db.json:', err);
  }
}
`;

// replace the old readDb and writeDb
const oldReadDbStart = code.indexOf('async function readDb()');
const oldWriteDbEnd = code.indexOf('// Trigger Google Apps Script Sync if configured');
if (oldReadDbStart !== -1 && oldWriteDbEnd !== -1) {
  code = code.substring(0, oldReadDbStart) + dbLogic + '\n' + code.substring(oldWriteDbEnd);
  fs.writeFileSync('server.ts', code);
  console.log('Successfully integrated pg in server.ts');
} else {
  console.error('Could not find old readDb/writeDb');
}
