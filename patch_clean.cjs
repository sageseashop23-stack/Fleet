const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/console\.log\("ensureTable.*?"\);\n/g, '');
code = code.replace(/console\.log\("readDb.*?"\);\n/g, '');
code = code.replace(/console\.log\("DATABASE_URL.*?"\);\n/g, '');
code = code.replace(/console\.log\("trips endpoint hit"\);\n/g, '');
code = code.replace(/console\.log\("trips db read done"\);\n/g, '');
fs.writeFileSync('server.ts', code);
