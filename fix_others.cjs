const fs = require('fs');

function replaceStr(file, regex, repl) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(regex, repl);
  fs.writeFileSync(file, code);
}

replaceStr('src/components/AppsScriptModal.tsx', /City Dispatch/g, 'Lady Driver Dispatch');
replaceStr('src/components/MonthlyEarningsReportModal.tsx', /City Dispatch/g, 'Lady Driver Dispatch');
replaceStr('server.ts', /City Dispatch/g, 'Lady Driver Dispatch');

