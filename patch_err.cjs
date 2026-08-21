const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/res\.status\(500\)\.json\(\{ error: err\.message \}\);/g, 'res.status(500).json({ error: err ? String(err) : "Unknown error", stack: err && err.stack });');
fs.writeFileSync('server.ts', code);
