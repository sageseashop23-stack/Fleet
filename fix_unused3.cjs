const fs = require('fs');

function replaceStr(file, regex, repl) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(regex, repl);
  fs.writeFileSync(file, code);
}

replaceStr('src/components/AiDispatchModal.tsx', /, CheckCircle2/g, '');
replaceStr('src/components/DriverConsoleView.tsx', /Shield, /g, '');
replaceStr('src/components/DriverConsoleView.tsx', /, HelpCircle/g, '');
replaceStr('src/components/MonthlyEarningsReportModal.tsx', /, DollarSign, TrendingUp, Users, CheckCircle2/g, '');

