const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/onOpenGasModal=\{\(\) => setIsGasModalOpen\(true\)\}/g, '');
code = code.replace(/const \[isGasModalOpen, setIsGasModalOpen\] = useState\(false\);/g, '');
fs.writeFileSync('src/App.tsx', code);
