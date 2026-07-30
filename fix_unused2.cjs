const fs = require('fs');

function replaceStr(file, target, repl) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(target, repl);
  fs.writeFileSync(file, code);
}

replaceStr('src/components/AiDispatchModal.tsx', 'Bot, Brain, Sparkles, Navigation, Clock, CheckCircle2, AlertTriangle, Loader2', 'Bot, Brain, Sparkles, Navigation, Clock, AlertTriangle, Loader2');
replaceStr('src/components/DriverConsoleView.tsx', 'MapPin, Navigation, Clock, Phone, Shield, CheckCircle, AlertTriangle, Loader2, MoreVertical, LogOut, HelpCircle', 'MapPin, Navigation, Clock, Phone, CheckCircle, AlertTriangle, Loader2, MoreVertical, LogOut');
replaceStr('src/components/MonthlyEarningsReportModal.tsx', 'Download, FileText, Calendar, DollarSign, TrendingUp, Users, CheckCircle2, X', 'Download, FileText, Calendar, X');

