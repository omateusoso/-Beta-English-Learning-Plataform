import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCXUWTirzIstv2cJcEMdVv7QRZrzvhs0gQ",
    authDomain: "english-learning-plataform.firebaseapp.com",
    projectId: "english-learning-plataform",
    storageBucket: "english-learning-plataform.firebasestorage.app",
    messagingSenderId: "228602865916",
    appId: "1:228602865916:web:d6bb48cf4b3ccd40164f79",
    measurementId: "G-F1HTVNP8K2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
