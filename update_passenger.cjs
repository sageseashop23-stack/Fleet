const fs = require('fs');

let html = fs.readFileSync('passenger.html', 'utf-8');

const scriptContent = `
import { db } from './src/firebase.js';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';

const { motion, AnimatePresence } = window.Motion;

let trips = [];

const reservePanel = document.getElementById("reserve-panel");
const trackPanel = document.getElementById("track-panel");
const reserveTab = document.getElementById("reserve-tab");
const trackTab = document.getElementById("track-tab");
const trackingResult = document.getElementById("tracking-result");
const trackingEmpty = document.getElementById("tracking-empty");
const today = new Date().toISOString().split("T")[0];
document.getElementById("ride-date").value = today;
document.getElementById("ride-date").min = today;

function setView(view) {
  const reserve = view === "reserve";
  reservePanel.classList.toggle("hidden", !reserve);
  trackPanel.classList.toggle("hidden", reserve);
  reserveTab.setAttribute("aria-selected", String(reserve));
  trackTab.setAttribute("aria-selected", String(!reserve));
  reserveTab.className = "canva-button flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#d85173] " + (reserve ? "bg-[#171717] text-white" : "text-[#686963] hover:bg-[#f3f3ef]");
  trackTab.className = "canva-button flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#d85173] " + (!reserve ? "bg-[#171717] text-white" : "text-[#686963] hover:bg-[#f3f3ef]");
}

function renderTrips() {
  const list = document.getElementById("recent-list");
  list.innerHTML = "";
  trips.forEach((trip) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "surface group flex w-full items-center justify-between gap-4 rounded-3xl p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#d4d4cc] focus:outline-none focus:ring-2 focus:ring-[#d85173]";
    const shortId = trip.id.substring(0, 7).toUpperCase();
    
    // Status text logic
    let statusText = trip.status;
    if (statusText === 'pending') statusText = 'Looking for driver...';
    if (statusText === 'assigned') statusText = 'Driver assigned';
    if (statusText === 'in_progress') statusText = 'On the way';
    
    card.innerHTML = \`<span class="flex min-w-0 items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f9e4e9] text-[#b92f55]"><i data-lucide="route" class="h-5 w-5"></i></span><span class="min-w-0"><span class="flex flex-wrap items-center gap-2"><span class="rounded-full bg-[#171717] px-2 py-1 text-[10px] font-bold tracking-[.1em] text-white">\${shortId}</span><span class="text-xs text-[#85867f]">\${trip.time}</span></span><strong class="mt-2 block truncate text-sm">\${trip.route}</strong><span class="mt-1 block text-xs text-[#777872]">\${statusText}</span></span></span><span class="shrink-0 text-right"><strong class="block text-sm">RM \${trip.fare.toFixed(2)}</strong><i data-lucide="arrow-up-right" class="ml-auto mt-2 h-4 w-4 text-[#85867f] transition group-hover:text-[#171717]"></i></span>\`;
    card.addEventListener("click", () => showTracking(trip.id));
    list.appendChild(card);
  });
  lucide.createIcons();
}

let activeTrackingUnsubscribe = null;

function showTracking(reference) {
  document.getElementById("booking-reference").value = reference;
  const shortId = reference.substring(0, 7).toUpperCase();
  document.getElementById("live-reference").textContent = shortId;
  trackingEmpty.classList.add("hidden");
  trackingResult.classList.remove("hidden");
  setView("track");
  
  if (activeTrackingUnsubscribe) activeTrackingUnsubscribe();
  
  // Real-time tracking of this specific trip
  const tripRef = doc(db, "trips", reference);
  activeTrackingUnsubscribe = onSnapshot(tripRef, (docSnap) => {
      if (docSnap.exists()) {
          const data = docSnap.data();
          const driverNameEl = document.querySelector('[data-template-id="driver-name"]');
          const driverCarEl = document.querySelector('[data-template-id="driver-car"]');
          const liveStatusEl = document.querySelector('[data-template-id="live-status"]');
          const liveTitleEl = document.querySelector('[data-template-id="live-title"]');
          
          if (data.status === 'pending') {
              liveStatusEl.textContent = 'SEARCHING...';
              liveTitleEl.textContent = 'Looking for a driver.';
              driverNameEl.textContent = 'Waiting for driver';
              driverCarEl.textContent = '...';
          } else if (data.status === 'assigned') {
              liveStatusEl.textContent = 'EN ROUTE TO PICKUP';
              liveTitleEl.textContent = 'Your driver is on the way.';
          } else if (data.status === 'in_progress') {
              liveStatusEl.textContent = 'IN TRANSIT';
              liveTitleEl.textContent = 'Heading to destination.';
          } else if (data.status === 'completed') {
              liveStatusEl.textContent = 'COMPLETED';
              liveTitleEl.textContent = 'You have arrived.';
          }
          
          if (data.driverId) {
             // In a real app we would join with drivers collection, 
             // but for simplicity we'll just show the driver ID or fetch it.
             const dRef = doc(db, "drivers", data.driverId);
             onSnapshot(dRef, (dSnap) => {
                 if (dSnap.exists()) {
                     const dData = dSnap.data();
                     driverNameEl.textContent = dData.name;
                     driverCarEl.textContent = dData.vehicle;
                 }
             });
          }
      }
  });
}

reserveTab.addEventListener("click", () => setView("reserve"));
trackTab.addEventListener("click", () => setView("track"));

document.getElementById("estimate-button").addEventListener("click", () => {
  const passengerCount = Number(document.getElementById("passengers").selectedIndex) + 1;
  const estimate = 22 + passengerCount * 2;
  document.getElementById("estimate-value").textContent = "RM " + estimate + "–" + (estimate + 6);
  // Store estimate secretly in dataset
  document.getElementById("estimate-button").dataset.baseFare = estimate;
});

document.getElementById("booking-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;
  const baseFare = Number(document.getElementById("estimate-button").dataset.baseFare || 25);
  
  try {
      const docRef = await addDoc(collection(db, "trips"), {
          route: \`\${pickup} → \${dropoff}\`,
          fare: baseFare,
          status: "pending",
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          createdAt: serverTimestamp()
      });
      
      document.getElementById("booking-success").classList.remove("hidden");
      document.getElementById("booking-success").scrollIntoView({ behavior: "smooth", block: "nearest" });
      
      // Setup the track button to track this new ride
      const trackBtn = document.getElementById("success-track-button");
      trackBtn.onclick = () => showTracking(docRef.id);
      
      // Reset form
      document.getElementById("booking-form").reset();
  } catch(e) {
      console.error("Error booking ride", e);
      alert("Failed to book ride.");
  }
});

document.getElementById("tracking-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const reference = document.getElementById("booking-reference").value.trim();
  if (reference) showTracking(reference);
});

// Setup Real-time Listener for all passenger trips
// For demo, we just get the latest 10 trips
const q = query(collection(db, "trips"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    trips = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})).slice(0, 10);
    renderTrips();
});

lucide.createIcons();
`;

// Replace script
html = html.replace(/<script>[\s\S]*?<\/script>/, `<script type="module">\n${scriptContent}\n</script>`);

fs.writeFileSync('passenger.html', html);
