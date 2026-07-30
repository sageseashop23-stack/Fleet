const fs = require('fs');
let code = fs.readFileSync('src/components/TopHeader.tsx', 'utf8');
code = code.replace(/        \{\/\* Live Status Chips \*\/\}(.|\n)*?<\/div>\n      <\/div>\n      \{\/\* Right Action Bar \*\/\}/g, '      </div>\n      {/* Right Action Bar */}');
fs.writeFileSync('src/components/TopHeader.tsx', code);
