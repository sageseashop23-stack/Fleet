import { app, db } from './src/firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';

async function seed() {
  const drivers = [
    { id: "LD-204", name: "Jordan Daniels", vehicle: "Perodua Aruz", status: "on_duty" },
    { id: "LD-118", name: "Nadia Rahman", vehicle: "Honda City", status: "on_duty" },
    { id: "LD-311", name: "Sofia Lim", vehicle: "Nissan Almera", status: "on_duty" },
    { id: "LD-087", name: "Aisha Karim", vehicle: "Toyota Vios", status: "off_duty" }
  ];
  for (let d of drivers) {
    await setDoc(doc(db, "drivers", d.id), d);
  }
  console.log("Seeded drivers.");
  process.exit(0);
}
seed();
