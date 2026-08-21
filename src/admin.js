import { db } from '/src/firebase.js';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';

let drivers = [];
let trips = [];
let filterMode = "all";

const list = document.getElementById("fleet-list");
const totalEl = document.getElementById("total-trips");
const liveEl = document.getElementById("live-trips");
const reportEl = document.getElementById("report-total");
const ledgerBody = document.getElementById("ledger-body");

function renderTrips() {
  if (!list || !ledgerBody) return;
  const pending = trips.filter(t => t.status === "pending" || t.status === "assigned" || t.status === "in_progress");
  
  if (totalEl) totalEl.textContent = trips.length;
  if (liveEl) liveEl.textContent = pending.length;
  
  let filtered = trips;
  if (filterMode === "duty") {
      filtered = trips.filter(t => t.status === 'pending');
  }

  list.innerHTML = "";
  filtered.forEach(trip => {
      const card = document.createElement("div");
      card.className = "flex items-center justify-between p-4 border-b border-[#e5e7eb] last:border-0";
      
      const shortId = trip.id.substring(0, 7).toUpperCase();
      let statusHtml = `<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">${trip.status}</span>`;
      if (trip.status === 'completed') statusHtml = `<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">completed</span>`;
      
      let dispatchBtn = trip.status === 'pending' 
         ? `<button class="dispatch-btn px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700" data-id="${trip.id}">Dispatch</button>`
         : `<span class="text-sm text-gray-500">Driver: ${trip.driverId || 'N/A'}</span>`;
         
      card.innerHTML = `
         <div>
            <div class="font-bold">${shortId}</div>
            <div class="text-sm text-gray-600">${trip.route}</div>
         </div>
         <div class="flex items-center gap-4">
            ${statusHtml}
            ${dispatchBtn}
         </div>
      `;
      list.appendChild(card);
  });
  
  // Attach dispatch events
  document.querySelectorAll('.dispatch-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
          const tripId = e.target.dataset.id;
          if (!drivers.length) {
              alert("No drivers available.");
              return;
          }
          const driver = drivers.find(d => d.status === 'on_duty') || drivers[0];
          await updateDoc(doc(db, "trips", tripId), {
              status: 'assigned',
              driverId: driver.id
          });
      });
  });

  // Render report ledger
  let totalFare = 0;
  ledgerBody.innerHTML = "";
  trips.forEach(trip => {
      const row = document.createElement("tr");
      row.className = "border-b border-[#e5e7eb]";
      row.innerHTML = `
          <td class="p-3">${trip.id.substring(0,7).toUpperCase()}</td>
          <td class="p-3">${trip.route}</td>
          <td class="p-3">RM ${trip.fare ? trip.fare.toFixed(2) : '0.00'}</td>
          <td class="p-3">${trip.status}</td>
      `;
      ledgerBody.appendChild(row);
      if (trip.status === 'completed') totalFare += trip.fare || 0;
  });
  if (reportEl) reportEl.textContent = "RM " + totalFare.toFixed(2);
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
        // Fetch data after login
        fetchData();
    } else {
        if (authOverlay) authOverlay.classList.remove('hidden');
    }
});

// Wrap existing fetch calls into fetchData()
function fetchData() {

  // Fetch drivers
onSnapshot(collection(db, "drivers"), (snapshot) => {
    drivers = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
});

// Fetch trips
const q = query(collection(db, "trips"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    trips = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    renderTrips();
  });
}

const allFilter = document.getElementById("all-filter");
const dutyFilter = document.getElementById("duty-filter");
if (allFilter) {
  allFilter.addEventListener("click", () => {
    filterMode = "all";
    allFilter.classList.add("bg-[#171717]", "text-white");
    allFilter.classList.remove("text-[#85867f]");
    dutyFilter.classList.remove("bg-[#171717]", "text-white");
    dutyFilter.classList.add("text-[#85867f]");
    renderTrips();
  });
}
if (dutyFilter) {
  dutyFilter.addEventListener("click", () => {
    filterMode = "duty";
    dutyFilter.classList.add("bg-[#171717]", "text-white");
    dutyFilter.classList.remove("text-[#85867f]");
    allFilter.classList.remove("bg-[#171717]", "text-white");
    allFilter.classList.add("text-[#85867f]");
    renderTrips();
  });
}

// Modals
function openModal() { document.getElementById("report-modal").classList.remove("hidden"); }
function closeModal() { document.getElementById("report-modal").classList.add("hidden"); }
if (document.getElementById("open-report")) document.getElementById("open-report").addEventListener("click", openModal);
if (document.getElementById("close-modal")) document.getElementById("close-modal").addEventListener("click", closeModal);
if (document.getElementById("cancel-modal")) document.getElementById("cancel-modal").addEventListener("click", closeModal);

if (window.lucide) window.lucide.createIcons();
