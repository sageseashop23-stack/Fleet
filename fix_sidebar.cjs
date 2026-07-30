const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(/CITY DISPATCH/g, 'LADY DRIVER DISPATCH');
code = code.replace(/Premium Logistics/g, 'Premium Logistic');

fs.writeFileSync('src/components/Sidebar.tsx', code);
