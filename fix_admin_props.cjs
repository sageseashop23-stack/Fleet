const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDispatchView.tsx', 'utf8');
code = code.replace(/onOpenGasModal: \(\) => void;/g, '');
code = code.replace(/onOpenGasModal,/g, '');
fs.writeFileSync('src/components/AdminDispatchView.tsx', code);
