import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

export const app = !getApps().length ? initializeApp(config) : getApp();
export const db = getFirestore(app);
