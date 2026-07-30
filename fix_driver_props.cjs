const fs = require('fs');
let code = fs.readFileSync('src/components/DriverConsoleView.tsx', 'utf8');
code = code.replace(/onImportGasData\?: \(\) => Promise<void>;/g, '');
code = code.replace(/onOpenGasModal\?: \(\) => void;/g, '');
code = code.replace(/onImportGasData,/g, '');
code = code.replace(/onOpenGasModal,/g, '');
fs.writeFileSync('src/components/DriverConsoleView.tsx', code);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/onImportGasData=\{handleImportGasData\}/g, '');
fs.writeFileSync('src/App.tsx', appCode);
