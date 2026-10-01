const fs = require('fs');

let html = fs.readFileSync('passenger.html', 'utf-8');

// Remove map container
const mapHtml = `
       </div>
       <div class="mt-7 w-full h-[300px] rounded-2xl overflow-hidden border border-white/10">
         <gmp-map id="live-map" center="3.139,101.686" zoom="14" map-id="DEMO_MAP_ID" style="height: 100%; width: 100%;"></gmp-map>
       </div>
       <div class="mt-7 grid gap-4 sm:grid-cols-2">
`;
html = html.replace(mapHtml, '       </div>       <div class="mt-7 grid gap-4 sm:grid-cols-2">');

// Remove MAP LOGIC
const mapLogicRegex = /\s*\/\/ MAP LOGIC[\s\S]*?mapEl\.innerMap\.fitBounds\(bounds\);\s*\}\s*\}\);\s*\}\s*\}/;
html = html.replace(mapLogicRegex, '');

// Add Autocomplete logic
const autocompleteLogic = `
// Google Maps Places Autocomplete
async function initAutocomplete() {
    try {
        const { Autocomplete } = await google.maps.importLibrary("places");
        
        const pickupInput = document.getElementById('pickup');
        const destinationInput = document.getElementById('destination');
        
        if (pickupInput) {
            new Autocomplete(pickupInput, {
                componentRestrictions: { country: "my" },
                fields: ["formatted_address", "geometry", "name"],
            });
        }
        
        if (destinationInput) {
            new Autocomplete(destinationInput, {
                componentRestrictions: { country: "my" },
                fields: ["formatted_address", "geometry", "name"],
            });
        }
    } catch (e) {
        console.error("Maps API not loaded or error initializing autocomplete", e);
    }
}
initAutocomplete();
`;

// Insert autocomplete logic before lucide.createIcons()
html = html.replace('lucide.createIcons();\n</script>', autocompleteLogic + '\nlucide.createIcons();\n</script>');

fs.writeFileSync('passenger.html', html);
