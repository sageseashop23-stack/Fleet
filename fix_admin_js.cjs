const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf-8');

adminHtml = adminHtml.replace(/document\s*\.getElementById\("close-button"\)\s*\.addEventListener[\s\S]*?\}\);/g, '');
adminHtml = adminHtml.replace(/document\s*\.getElementById\("reopen-button"\)\s*\.addEventListener[\s\S]*?\}\);/g, '');

fs.writeFileSync('admin.html', adminHtml);
