const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/async function ensureTable\(\) \{/, 'async function ensureTable() {\nconsole.log("ensureTable start");');
code = code.replace(/await pool\.query\(`[\s\S]*?`\);/, 'console.log("ensureTable CREATE TABLE");\n$&');
code = code.replace(/const { rowCount } = await pool\.query\('SELECT id/, 'console.log("ensureTable SELECT id");\n$&');
code = code.replace(/await pool\.query\('INSERT/, 'console.log("ensureTable INSERT");\n$&');

code = code.replace(/async function readDb\(\): Promise<LocalDb> \{/, 'async function readDb(): Promise<LocalDb> {\nconsole.log("readDb start, pool:", !!pool, "isTableInitialized:", isTableInitialized);');
code = code.replace(/const { rows } = await pool\.query\('SELECT data FROM app_state WHERE id = 1'\);/, 'console.log("readDb SELECT data");\n$&');

fs.writeFileSync('server.ts', code);
console.log("Traces added");
