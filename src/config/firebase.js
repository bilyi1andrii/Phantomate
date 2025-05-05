import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDEsAztwLJjj_d736wrRwfYiCFhA4b4uyc",
    authDomain: "phantomate-d8525.firebaseapp.com",
    projectId: "phantomate-d8525",
    storageBucket: "phantomate-d8525.firebasestorage.app",
    messagingSenderId: "1050235058981",
    appId: "1:1050235058981:web:8e14c9344b3441bafbb8cc",
    measurementId: "G-FMR5NHVCG6"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);