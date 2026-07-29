const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace('          setIsMobileOpen={setIsMobileSidebarOpen}\n        />\n      {/* Main Content Workspace */}', '          setIsMobileOpen={setIsMobileSidebarOpen}\n        />\n        )}\n      {/* Main Content Workspace */}');
fs.writeFileSync('src/App.tsx', content);
