const fs = require('fs');

['src/components/Sidebar.tsx', 'src/components/TopHeader.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\\`/g, '`');
  code = code.replace(/\\\$/g, '$');
  fs.writeFileSync(file, code);
});
