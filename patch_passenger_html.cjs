const fs = require('fs');

let html = fs.readFileSync('passenger.html', 'utf-8');

// Inject Google Maps script in head
const scriptTag = `
  <script src="https://maps.googleapis.com/maps/api/js?key=%VITE_GOOGLE_MAPS_API_KEY%&libraries=places,marker,core&v=weekly"></script>
`;
if (!html.includes('maps.googleapis.com')) {
    html = html.replace('</head>', scriptTag + '\n</head>');
}

// Add the map container
const mapHtml = `
       </div>
       <div class="mt-7 w-full h-[300px] rounded-2xl overflow-hidden border border-white/10">
         <gmp-map id="live-map" center="3.139,101.686" zoom="14" map-id="DEMO_MAP_ID" style="height: 100%; width: 100%;"></gmp-map>
       </div>
       <div class="mt-7 grid gap-4 sm:grid-cols-2">
`;
html = html.replace('       </div>       <div class="mt-7 grid gap-4 sm:grid-cols-2">', mapHtml);

fs.writeFileSync('passenger.html', html);
