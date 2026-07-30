const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "const apiBase = import.meta.env.VITE_API_BASE_URL || '';",
  "// Force local API endpoints since we have a built-in Express server.\n  // If deploying frontend-only, you can restore: const apiBase = import.meta.env.VITE_API_BASE_URL || '';\n  const apiBase = '';"
);
fs.writeFileSync('src/App.tsx', code);
