const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf8');
code = code.replace(/onOpenGasModal: \(\) => void;/g, '');
code = code.replace(/onOpenGasModal,/g, '');

const btnMatch = /<button[\s\S]*?onClick=\{onOpenGasModal\}[\s\S]*?<\/button>/;
code = code.replace(btnMatch, '');

fs.writeFileSync('src/components/TopHeader.tsx', code);
