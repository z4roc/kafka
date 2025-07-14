// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// JA MAN KANN UND DARF DIE PUSHEN; DIE KONFIGURATION IST FÜR ALLE ZUGÄNGLICH SERVER RULES HANDLEN
const firebaseConfig = {
  apiKey: "AIzaSyDKB-MvJjmgz2gYz68AGIyaoEozx5RB77k",
  authDomain: "yourical-enchanced.firebaseapp.com",
  projectId: "yourical-enchanced",
  storageBucket: "yourical-enchanced.firebasestorage.app",
  messagingSenderId: "757017764406",
  appId: "1:757017764406:web:d785568d907ac87888ee97",
  measurementId: "G-HJE8CSF78B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
export { app, auth, db, googleProvider, storage };
