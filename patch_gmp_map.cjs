const fs = require('fs');
let html = fs.readFileSync('passenger.html', 'utf-8');

const mapHtml = `
       </div>
       <div class="mt-7 w-full h-[300px] rounded-2xl overflow-hidden border border-white/10">
         <gmp-map id="live-map" center="3.139,101.686" zoom="14" map-id="DEMO_MAP_ID" style="height: 100%; width: 100%;"></gmp-map>
       </div>
       <div class="mt-7 grid gap-4 sm:grid-cols-2">
`;

// It didn't match because there might be a newline between them
html = html.replace(/<\/div>\s*<div class="mt-7 grid gap-4 sm:grid-cols-2">/, mapHtml);

fs.writeFileSync('passenger.html', html);
