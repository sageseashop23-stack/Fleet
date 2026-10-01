import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(config) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events');
provider.addScope('https://www.googleapis.com/auth/calendar');

let cachedAccessToken: string | null = null;
let isSigningInGlobal = false;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggingIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const clearAuthError = () => {
    setAuthError(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        cachedAccessToken = null;
        setAccessToken(null);
      } else {
        setAccessToken(cachedAccessToken);
        setAuthError(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (isSigningInGlobal) {
      console.info("Sign-in is already in progress, ignoring duplicate click.");
      return;
    }
    isSigningInGlobal = true;
    setIsLoggingIn(true);
    setAuthError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
        setAccessToken(credential.accessToken);
      }
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') {
        console.info("Sign-in popup closed or cancelled by user.");
      } else if (code === 'auth/popup-blocked') {
        const msg = "Sign-in popup was blocked by your browser. Please allow popups for this site in your browser settings or address bar and try again.";
        console.warn(msg);
        setAuthError(msg);
      } else {
        console.error("Error signing in: ", error);
        setAuthError(error?.message || "Failed to sign in. Please try again.");
      }
    } finally {
      isSigningInGlobal = false;
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      cachedAccessToken = null;
      setAccessToken(null);
      setAuthError(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLoggingIn, authError, clearAuthError, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
