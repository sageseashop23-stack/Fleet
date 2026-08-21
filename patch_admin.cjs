const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf-8');

// We will inject the firebase import at the top of the main script block
const firebaseInject = `
import { db } from './src/firebase.js';
import { collection, doc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';

// Replace trips array with realtime fetching
`;

html = html.replace('<script>', '<script type="module">\n' + firebaseInject);

// Write back
fs.writeFileSync('admin.html', html);
