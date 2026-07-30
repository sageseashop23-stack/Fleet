const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(/Premium Logistic/g, 'SAFEST & AFFORDABLE LOGISTIC');

fs.writeFileSync('src/components/Sidebar.tsx', code);
