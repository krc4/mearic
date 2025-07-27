// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4UHpyAq3PLgghN0PLv3JdeBok_y6vv60",
  authDomain: "nurunyolu.firebaseapp.com",
  projectId: "nurunyolu",
  storageBucket: "nurunyolu.firebasestorage.app",
  messagingSenderId: "1098560766367",
  appId: "1:1098560766367:web:da721d069f5229ba973daa"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
