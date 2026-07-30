const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// replace console.warn with a silent or single warning
code = code.replace(
  "console.warn('Amaran sambungan API Backend, menggunakan keadaan setempat:', err);",
  "if (!window.__apiWarningLogged) { console.warn('Amaran sambungan API Backend, menggunakan keadaan setempat (akan disenyapkan untuk cubaan seterusnya):', err); window.__apiWarningLogged = true; }"
);

fs.writeFileSync('src/App.tsx', code);
