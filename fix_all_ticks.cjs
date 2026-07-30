const fs = require('fs');
function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const p = dir + '/' + file;
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
            walkDir(p);
        } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
            let code = fs.readFileSync(p, 'utf8');
            if (code.includes('\\`')) {
              code = code.replace(/\\`/g, '`');
              code = code.replace(/\\\$/g, '$');
              fs.writeFileSync(p, code);
              console.log('Fixed', p);
            }
        }
    }
}
walkDir('src');
