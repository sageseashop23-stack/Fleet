const fs = require('fs');

function removeUnused(filePath, replacements) {
  let code = fs.readFileSync(filePath, 'utf8');
  for (const [target, replacement] of replacements) {
    code = code.replace(target, replacement);
  }
  fs.writeFileSync(filePath, code);
}

// App.tsx
removeUnused('src/App.tsx', [
  [/import React, \{/g, 'import {']
]);

// AdminDispatchView.tsx
removeUnused('src/components/AdminDispatchView.tsx', [
  [/ShieldCheck, Truck, AlertTriangle, FileText, UserPlus/g, 'ShieldCheck, AlertTriangle, UserPlus'],
  [/\n  onOpenReportModal,\n  onOpenGasModal,\n  onOpenAiModal/g, ''],
  [/const \[newDriverAdmin, setBaruDriverAdmin\] = useState\(false\);/g, 'const [newDriverAdmin] = useState(false);']
]);

// AiDispatchModal.tsx
removeUnused('src/components/AiDispatchModal.tsx', [
  [/Bot, Brain, Sparkles, Navigation, Clock, CheckCircle2, AlertTriangle, Loader2/g, 'Bot, Brain, Sparkles, Navigation, Clock, AlertTriangle, Loader2']
]);

// AppsScriptModal.tsx
removeUnused('src/components/AppsScriptModal.tsx', [
  [/FileSpreadsheet, Copy, Check, ExternalLink, RefreshCw, X, ShieldAlert/g, 'FileSpreadsheet, Copy, Check, RefreshCw, X, ShieldAlert']
]);

// DriverConsoleView.tsx
removeUnused('src/components/DriverConsoleView.tsx', [
  [/MapPin, Navigation, Clock, Phone, Shield, CheckCircle, AlertTriangle, Loader2, MoreVertical, LogOut, HelpCircle/g, 'MapPin, Navigation, Clock, Phone, CheckCircle, AlertTriangle, Loader2, MoreVertical, LogOut']
]);

// MonthlyEarningsReportModal.tsx
removeUnused('src/components/MonthlyEarningsReportModal.tsx', [
  [/Download, FileText, Calendar, DollarSign, TrendingUp, Users, CheckCircle2, X/g, 'Download, FileText, Calendar, X']
]);

// Sidebar.tsx
removeUnused('src/components/Sidebar.tsx', [
  [/import \{ Driver, Trip \} from '\.\.\/types';/g, "import { Driver } from '../types';"],
  [/\n  onLogoutDriver,/g, '']
]);

// TopHeader.tsx
removeUnused('src/components/TopHeader.tsx', [
  [/FileSpreadsheet, Bot, FileText, PauseCircle, PlayCircle/g, 'FileSpreadsheet, Bot, PauseCircle, PlayCircle'],
  [/\n  disputedTripsCount,\n  onOpenNewDispatch,\n  onOpenReportModal,/g, '\n  onOpenNewDispatch,']
]);
