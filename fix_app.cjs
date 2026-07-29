const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
// Fix sidebar
code = code.replace('        />\n          </>\n          )}', '        />\n          )}');
// Fix topheader
code = code.replace('              onToggleAutoRefresh={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}\n            />\n          )}', '              onToggleAutoRefresh={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}\n            />\n          </>\n          )}');
fs.writeFileSync('src/App.tsx', code);
