const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/app\.get\('\/api\/trips', async \(_req, res\) => \{/, 
  'app.get(\'/api/trips\', async (_req, res) => {\n  console.log("trips endpoint hit");\n  try {\n    const db = await readDb();\n    console.log("trips db read done");\n    res.json(db.trips);\n  } catch (err) {\n    console.error("trips error", err);\n    res.status(500).json({ error: err.message });\n  }\n});\n/*');
code = code.replace(/app\.post\('\/api\/trips', async \(req, res\) => \{/, '*/\napp.post(\'/api/trips\', async (req, res) => {');

fs.writeFileSync('server.ts', code);
