// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJe_Pli3afXd1ddVctWbn7tu251_FaMNk",
  authDomain: "quizapp-fcfb5.firebaseapp.com",
  projectId: "quizapp-fcfb5",
  storageBucket: "quizapp-fcfb5.firebasestorage.app",
  messagingSenderId: "180141145950",
  appId: "1:180141145950:web:5e6de496aeb0b3a3fad9cf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
auth.settings.appVerificationDisabledForTesting = true;