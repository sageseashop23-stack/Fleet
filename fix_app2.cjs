const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "if (!window.__apiWarningLogged) { console.warn('Amaran sambungan API Backend, menggunakan keadaan setempat (akan disenyapkan untuk cubaan seterusnya):', err); window.__apiWarningLogged = true; }",
  "if (!(window as any).__apiWarningLogged) { console.warn('Amaran sambungan API Backend, menggunakan keadaan setempat (akan disenyapkan untuk cubaan seterusnya):', err); (window as any).__apiWarningLogged = true; }"
);

fs.writeFileSync('src/App.tsx', code);
