import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "./firebase.js";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events');
provider.addScope('https://www.googleapis.com/auth/calendar');

let cachedAccessToken = null;
let isSigningIn = false;

export async function signInWithGoogle() {
  if (isSigningIn) {
    console.info("Sign-in is already in progress. Ignoring duplicate click.");
    return null;
  }
  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential && credential.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return result.user;
  } catch (error) {
    const code = error?.code || '';
    if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') {
      console.info("Sign-in popup closed or cancelled by user.");
      return null;
    }
    if (code === 'auth/popup-blocked') {
      const msg = "Sign-in popup was blocked by your browser. Please allow popups for this site and try again.";
      console.warn(msg);
      throw new Error(msg);
    }
    console.error("Error signing in: ", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
    cachedAccessToken = null;
  } catch (error) {
    console.error("Error signing out: ", error);
  }
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
    }
    callback(user);
  });
}

export function getAccessToken() {
  return cachedAccessToken;
}

