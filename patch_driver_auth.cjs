const fs = require('fs');
let js = fs.readFileSync('src/driver.js', 'utf-8');

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
        fetchData();
    } else {
        if (authOverlay) authOverlay.classList.remove('hidden');
    }
});

function fetchData() {
`;

js = js.replace(`const q = query(collection(db, "trips"), where("driverId", "==", DRIVER_ID));`, authInject + `\nconst q = query(collection(db, "trips"), where("driverId", "==", DRIVER_ID));`);

js = js.replace(`    trips = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    renderTrips();
});`, `    trips = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    renderTrips();
  });
}`);

fs.writeFileSync('src/driver.js', js);
