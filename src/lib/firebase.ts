import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD6ldekcfeuqkl-U0A2xBHkdDTdYE9GIYY",
    authDomain: "revistapraxis.firebaseapp.com",
    projectId: "revistapraxis",
    storageBucket: "revistapraxis.firebasestorage.app",
    messagingSenderId: "192281060710",
    appId: "1:192281060710:web:40a14a5525668e15fcd4a7",
    measurementId: "G-EPES3LT8E2"
};

// Initialize Firebase (Singleton pattern to avoid multiple instances)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
