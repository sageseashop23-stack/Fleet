const fs = require('fs');
const path = require('path');

const appMode = process.env.VITE_APP_MODE ? process.env.VITE_APP_MODE.toLowerCase() : null;
if (appMode && ['passenger', 'admin', 'driver'].includes(appMode)) {
    console.log(`Setting up dist/ for VITE_APP_MODE=${appMode}`);
    const sourceFile = path.join(__dirname, 'dist', `${appMode}.html`);
    const destFile = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, destFile);
        console.log(`Copied ${appMode}.html to index.html for deployment.`);
    } else {
        console.warn(`Warning: ${sourceFile} not found.`);
    }
} else {
    console.log('No specific VITE_APP_MODE found. Using default portal index.');
}
