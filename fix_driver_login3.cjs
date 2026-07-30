const fs = require('fs');

let code = fs.readFileSync('src/components/DriverConsoleView.tsx', 'utf8');

code = code.replace(
  /setLoginError\('Invalid 4-digit PIN code. Check registered PINs below or click "Sync Drivers from Google Sheet"\.'\);/g,
  "setLoginError('Invalid 4-digit PIN code. Please check your PIN and try again.');"
);

const errorBlockMatch = /\{loginError && \([\s\S]*?<\/div>[\s]*\)\}/;
code = code.replace(errorBlockMatch, `{loginError && (
              <div className="mb-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3 rounded-xl border border-rose-500/20 text-xs font-bold text-center animate-in fade-in zoom-in duration-300 space-y-2">
                <p>{loginError}</p>
              </div>
            )}`);

// Also clean up any lingering 'isSyncing' or 'handleSyncGSheet' references that might cause compilation errors if I only removed the function declaration.
code = code.replace(/disabled=\{isSyncing\}/g, '');
code = code.replace(/onClick=\{handleSyncGSheet\}/g, '');

fs.writeFileSync('src/components/DriverConsoleView.tsx', code);
