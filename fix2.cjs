const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace('          </motion.div>\n      </AnimatePresence>', '          </motion.div>\n        )}\n      </AnimatePresence>');
fs.writeFileSync('src/App.tsx', content);
