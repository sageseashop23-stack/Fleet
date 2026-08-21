const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newEnsure = `
let ensureTablePromise: Promise<void> | null = null;
async function ensureTable() {
  if (!pool) return;
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      await pool.query(\`
        CREATE TABLE IF NOT EXISTS app_state (
          id SERIAL PRIMARY KEY,
          data JSONB NOT NULL
        )
      \`);
      const { rowCount } = await pool.query('SELECT id FROM app_state WHERE id = 1');
      if (rowCount === 0) {
        const initialData: LocalDb = {
          drivers: [],
          trips: [],
          activityLogs: [],
          gasConfig: { webAppUrl: '', autoSyncOnComplete: true, syncStatus: 'IDLE' }
        };
        let data = initialData;
        try {
          if (fs.existsSync(DB_FILE)) {
            data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
          }
        } catch (err) {}
        await pool.query('INSERT INTO app_state (id, data) VALUES (1, $1) ON CONFLICT (id) DO NOTHING', [JSON.stringify(data)]);
      }
    })();
  }
  return ensureTablePromise;
}
`;

code = code.replace(/async function ensureTable\(\) \{[\s\S]*?let isTableInitialized = false;/m, newEnsure + '\nlet isTableInitialized = false;');
fs.writeFileSync('server.ts', code);
console.log('Race condition patched');
