const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Playfair\+Display[^"]*" rel="stylesheet">/, '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet">');
fs.writeFileSync('index.html', code);
