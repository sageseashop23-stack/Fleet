const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf-8');
const reportHtml = fs.readFileSync('report.html', 'utf-8');

const scriptStart = reportHtml.lastIndexOf('<script>');
const scriptEnd = reportHtml.lastIndexOf('</script>');
let scriptContent = reportHtml.substring(scriptStart + 8, scriptEnd);

scriptContent = scriptContent.replace(/document\.addEventListener\("DOMContentLoaded", \(\) => \{/, '');
scriptContent = scriptContent.replace(/\}\);\s*$/, '');
scriptContent = scriptContent.replace(/document\.getElementById\("close-button"\)\.addEventListener[^;]+;/, '');
scriptContent = scriptContent.replace(/document\.getElementById\("reopen-button"\)\.addEventListener[^;]+;/, '');
scriptContent = `
// --- Report Script ---
(function() {
${scriptContent}
})();
`;

adminHtml = adminHtml.replace('lucide.createIcons();', scriptContent + '\n        lucide.createIcons();');
fs.writeFileSync('admin.html', adminHtml);
