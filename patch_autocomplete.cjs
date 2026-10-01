const fs = require('fs');

let html = fs.readFileSync('passenger.html', 'utf-8');

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

html = html.replace(/<\/script>\s*<\/body>/, autocompleteLogic + '\n</script></body>');
fs.writeFileSync('passenger.html', html);
