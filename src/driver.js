import { db } from '/src/firebase.js';
import { collection, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';

const DRIVER_ID = "LD-204"; // Demo driver ID
let trips = [];

const list = document.getElementById("trip-list");
const statTrips = document.getElementById("stat-trips");
const statEarnings = document.getElementById("stat-earnings");

function renderTrips() {
  if (!list) return;
  list.innerHTML = "";
  
  let completedCount = 0;
  let earnings = 0;
  
  trips.forEach(trip => {
      if (trip.status === 'completed') {
          completedCount++;
          earnings += (trip.fare || 0);
      }
      
      // Only show active assigned trips in the main list
      if (trip.status === 'assigned' || trip.status === 'in_progress') {
          const card = document.createElement("div");
          card.className = "p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-4";
          const shortId = trip.id.substring(0, 7).toUpperCase();
          
          let btnText = trip.status === 'assigned' ? 'Start Trip' : 'Complete Trip';
          let btnAction = trip.status === 'assigned' ? 'in_progress' : 'completed';
          
          card.innerHTML = `
             <div class="flex justify-between items-center mb-2">
                 <span class="font-bold text-sm text-gray-800">${shortId}</span>
                 <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">${trip.status.replace('_', ' ').toUpperCase()}</span>
             </div>
             <p class="text-sm text-gray-600 mb-4">${trip.route}</p>
             <button class="action-btn w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800" data-id="${trip.id}" data-action="${btnAction}">
                 ${btnText}
             </button>
          `;
          list.appendChild(card);
      }
  });
  
  if (statTrips) statTrips.textContent = completedCount;
  if (statEarnings) statEarnings.textContent = "RM " + earnings.toFixed(2);
  
  // Attach events
  document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
          const tripId = e.target.dataset.id;
          const newStatus = e.target.dataset.action;
          await updateDoc(doc(db, "trips", tripId), {
              status: newStatus
          });
      });
  });
}


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

const q = query(collection(db, "trips"), where("driverId", "==", DRIVER_ID));
onSnapshot(q, (snapshot) => {
    trips = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    renderTrips();
  });
}

if (window.lucide) window.lucide.createIcons();
