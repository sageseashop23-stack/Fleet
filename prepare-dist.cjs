const fs = require('fs');
const path = require('path');

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
    console.log('Prepared dist/ HTML files successfully.');
}

