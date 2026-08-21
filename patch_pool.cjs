const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const pool = .*?;/, 'const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL.trim(), max: 20 }) : null;\nconsole.log("DATABASE_URL length:", process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);\nif (pool) pool.on("error", (err) => console.error("Pool error:", err));');

fs.writeFileSync('server.ts', code);
