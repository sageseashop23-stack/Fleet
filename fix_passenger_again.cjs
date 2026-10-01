// I just want to make sure I did not break passenger.html
const fs = require('fs');
let html = fs.readFileSync('passenger.html', 'utf-8');
console.log("Is Map included? " + html.includes('gmp-map'));
