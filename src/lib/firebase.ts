// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgQ54alG6MtuJyWaL-Yzbts5in-KxwQWw",
  authDomain: "event-hub-38053.firebaseapp.com",
  projectId: "event-hub-38053",
  storageBucket: "event-hub-38053.appspot.com",
  messagingSenderId: "177985952477",
  appId: "1:177985952477:web:cea3eb8d328713dc665934",
  measurementId: "G-RM4PRSVMQY"
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
