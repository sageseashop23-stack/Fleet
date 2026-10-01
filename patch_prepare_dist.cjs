const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('prepare-dist.cjs', 'utf-8');
content = content.replace("fs.copyFileSync(sourceFile, destFile);", `
        let htmlContent = fs.readFileSync(sourceFile, 'utf-8');
        htmlContent = htmlContent.replace(/%VITE_GOOGLE_MAPS_API_KEY%/g, process.env.VITE_GOOGLE_MAPS_API_KEY || '');
        fs.writeFileSync(destFile, htmlContent);
`);
// Also patch all HTML files in dist/
content += `
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
    fs.readdirSync(distDir).forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(distDir, file);
            let html = fs.readFileSync(filePath, 'utf-8');
            html = html.replace(/%VITE_GOOGLE_MAPS_API_KEY%/g, process.env.VITE_GOOGLE_MAPS_API_KEY || '');
            fs.writeFileSync(filePath, html);
        }
    });
}
`;
fs.writeFileSync('prepare-dist.cjs', content);
