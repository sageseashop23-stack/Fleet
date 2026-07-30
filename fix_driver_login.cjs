const fs = require('fs');

let code = fs.readFileSync('src/components/DriverConsoleView.tsx', 'utf8');

// Replace handleSyncGSheet completely (or just make it a no-op to be safe if it's used elsewhere, but it's only in this component)
const handleSyncFn = `  const handleSyncGSheet = async () => {
    if (!onImportGasData) return;
    setIsSyncing(true);
    setSyncMessage(null);
    setLoginError(null);
    try {
      await onImportGasData();
      setSyncMessage('Successfully imported drivers & trips from Google Sheet!');
    } catch (err: any) {
      setLoginError('Failed to import from Google Sheet: ' + (err.message || 'Check Web App URL'));
    } finally {
      setIsSyncing(false);
    }
  };`;
code = code.replace(handleSyncFn, '');

// Remove the sync message render
const syncMessageRender = `          {syncMessage && (
            <div className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-4 h-4" />
              <span>{syncMessage}</span>
            </div>
          )}`;
code = code.replace(syncMessageRender, '');

// The Pull from Google Sheet button
const pullBtn = `              {onImportGasData && (
                <button
                  type="button"
                  onClick={handleSyncGSheet}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                >
                  <RefreshCw className={\`w-3 h-3 \${isSyncing ? 'animate-spin' : ''}\`} />
                  <span>Pull from Google Sheet</span>
                </button>
              )}`;
code = code.replace(pullBtn, '');

// The bottom configure button
const configBtn = `            {onOpenGasModal && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onOpenGasModal}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Configure Google Sheet Sync Settings</span>
                </button>
              </div>
            )}`;
code = code.replace(configBtn, '');

fs.writeFileSync('src/components/DriverConsoleView.tsx', code);
