// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALBYA4f82Qo43rzYK5-ARXD084z2c2bbM",
  authDomain: "mini-linkedin-platform.firebaseapp.com",
  projectId: "mini-linkedin-platform",
  storageBucket: "mini-linkedin-platform.firebasestorage.app",
  messagingSenderId: "994186113812",
  appId: "1:994186113812:web:309ba5557be25cad1ec801",
  measurementId: "G-WM2E73GCEZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
