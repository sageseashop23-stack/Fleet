const fs = require('fs');

let html = fs.readFileSync('passenger.html', 'utf-8');

const metaTag = `<meta id="gmap-key" name="gmap-key" content="%VITE_GOOGLE_MAPS_API_KEY%">`;
if (!html.includes('id="gmap-key"')) {
    html = html.replace('</head>', metaTag + '\n</head>');
}

// Inject map logic into showTracking
const mapLogic = `
          // MAP LOGIC
          const mapEl = document.getElementById('live-map');
          if (mapEl && mapEl.innerMap) {
             const routeText = data.route || '';
             const parts = routeText.split(' → ');
             if (parts.length === 2) {
                 const apiKey = document.getElementById('gmap-key').content;
                 Promise.all([
                     fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(parts[0] + ' Malaysia') + '&key=' + apiKey).then(r=>r.json()),
                     fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(parts[1] + ' Malaysia') + '&key=' + apiKey).then(r=>r.json())
                 ]).then(async ([pickupRes, dropoffRes]) => {
                     const pLoc = pickupRes.results[0]?.geometry?.location;
                     const dLoc = dropoffRes.results[0]?.geometry?.location;
                     
                     // Clear previous markers
                     if (window.currentMarkers) {
                         window.currentMarkers.forEach(m => m.map = null);
                     }
                     window.currentMarkers = [];
                     
                     if (pLoc && dLoc) {
                         const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
                         
                         const pinA = new PinElement({ background: "#171717", glyphColor: "#ffffff" });
                         const markerA = new AdvancedMarkerElement({
                             map: mapEl.innerMap,
                             position: pLoc,
                             title: "Pickup",
                             content: pinA.element
                         });
                         
                         const pinB = new PinElement({ background: "#d85173", glyphColor: "#ffffff" });
                         const markerB = new AdvancedMarkerElement({
                             map: mapEl.innerMap,
                             position: dLoc,
                             title: "Dropoff",
                             content: pinB.element
                         });
                         
                         window.currentMarkers.push(markerA, markerB);
                         
                         // bounds
                         const bounds = new google.maps.LatLngBounds();
                         bounds.extend(pLoc);
                         bounds.extend(dLoc);
                         mapEl.innerMap.fitBounds(bounds);
                     }
                 });
             }
          }
`;

html = html.replace('// In a real app we would join with drivers collection,', mapLogic + '\n             // In a real app we would join with drivers collection,');

fs.writeFileSync('passenger.html', html);
