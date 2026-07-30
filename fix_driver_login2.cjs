const fs = require('fs');

let code = fs.readFileSync('src/components/DriverConsoleView.tsx', 'utf8');
code = code.replace("  const [isSyncing, setIsSyncing] = useState(false);\n", '');
code = code.replace("  const [syncMessage, setSyncMessage] = useState<string | null>(null);\n", '');
fs.writeFileSync('src/components/DriverConsoleView.tsx', code);
