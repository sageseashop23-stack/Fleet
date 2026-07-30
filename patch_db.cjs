const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// replace function signatures
code = code.replace(/function readDb\(\): LocalDb \{/g, 'async function readDb(): Promise<LocalDb> {');
code = code.replace(/function writeDb\(data: LocalDb\) \{/g, 'async function writeDb(data: LocalDb) {');

// replace route handler signatures
code = code.replace(/app\.get\('([^']+)', \(_req, res\) => \{/g, 'app.get(\'$1\', async (_req, res) => {');
code = code.replace(/app\.post\('([^']+)', \(req, res\) => \{/g, 'app.post(\'$1\', async (req, res) => {');
code = code.replace(/app\.patch\('([^']+)', \(req, res\) => \{/g, 'app.patch(\'$1\', async (req, res) => {');
code = code.replace(/app\.delete\('([^']+)', \(req, res\) => \{/g, 'app.delete(\'$1\', async (req, res) => {');

// replace function calls
code = code.replace(/const db = readDb\(\);/g, 'const db = await readDb();');
code = code.replace(/writeDb\(db\);/g, 'await writeDb(db);');

fs.writeFileSync('server.ts', code);
console.log('patched server.ts');
