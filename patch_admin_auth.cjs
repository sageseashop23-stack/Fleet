const fs = require('fs');

let js = fs.readFileSync('src/admin.js', 'utf-8');

const authInject = `
import { signInWithGoogle, logOut, subscribeToAuth } from './auth.js';

let currentUser = null;

const authOverlay = document.getElementById('auth-overlay');
const loginBtn = document.getElementById('google-login-btn');

if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        try {
            await signInWithGoogle();
        } catch (e) {
            alert('Login failed: ' + e.message);
        }
    });
}

subscribeToAuth((user) => {
    currentUser = user;
    if (user) {
        if (authOverlay) authOverlay.classList.add('hidden');
        // Fetch data after login
        fetchData();
    } else {
        if (authOverlay) authOverlay.classList.remove('hidden');
    }
});

// Wrap existing fetch calls into fetchData()
function fetchData() {
`;

// Replace the two onSnapshot calls with the fetchData function
js = js.replace(`// Fetch drivers`, authInject + `\n  // Fetch drivers`);
js = js.replace(`    trips = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    renderTrips();
});`, `    trips = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    renderTrips();
  });
}`);

fs.writeFileSync('src/admin.js', js);
