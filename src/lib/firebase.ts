// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAgQ54alG6MtuJyWaL-Yzbts5in-KxwQWw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eventhub.buzz",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "event-hub-38053",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "event-hub-38053.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "177985952477",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:177985952477:web:cea3eb8d328713dc665934",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-RM4PRSVMQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account', // Always show account selection
});
// Add Google Calendar API scopes
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');

// Initialize Microsoft Auth Provider
export const microsoftProvider = new OAuthProvider('microsoft.com');
// Configure Microsoft provider scopes for calendar access
microsoftProvider.setCustomParameters({
  tenant: 'common', // This allows both personal and work accounts
  prompt: 'select_account', // Always show account selection
});
microsoftProvider.addScope('https://graph.microsoft.com/Calendars.Read');
microsoftProvider.addScope('https://graph.microsoft.com/User.Read');

// Initialize Analytics (only in production)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
