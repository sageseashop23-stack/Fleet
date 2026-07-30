const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("import { AppsScriptModal } from './components/AppsScriptModal';", '');

const modalMatch = /<AppsScriptModal[\s\S]*?\/>/;
code = code.replace(modalMatch, '');

fs.writeFileSync('src/App.tsx', code);
