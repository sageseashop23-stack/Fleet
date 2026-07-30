const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf8');
code = code.replace(/        <button\n          onClick={onOpenReportModal}(.|\n)*?<\/button>/, '');
fs.writeFileSync('src/components/TopHeader.tsx', code);
