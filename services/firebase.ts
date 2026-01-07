import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const API_KEY = process.env.API_KEY || '';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "sentinelle-verte-ci.firebaseapp.com",
  projectId: "sentinelle-verte-ci",
  storageBucket: "sentinelle-verte-ci.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Singleton pattern pour éviter les ré-initialisations multiples
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configuration optionnelle pour la persistance locale
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
