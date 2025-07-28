
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "nurunyolu",
  "appId": "1:1098560766367:web:da721d069f5229ba973daa",
  "storageBucket": "nurunyolu.firebasestorage.app",
  "apiKey": "AIzaSyC4UHpyAq3PLgghN0PLv3JdeBok_y6vv60",
  "authDomain": "nurunyolu.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1098560766367"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
