const fs = require('fs');
let html = fs.readFileSync('driver.html', 'utf-8');
const firebaseInject = `
import { db } from './src/firebase.js';
import { collection, doc, onSnapshot, query, where, updateDoc } from 'firebase/firestore';

// Replace static data
`;
html = html.replace('<script>', '<script type="module">\n' + firebaseInject);
fs.writeFileSync('driver.html', html);
