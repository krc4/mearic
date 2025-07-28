
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

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
// This pattern prevents re-initializing the app on every render.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { db, auth };
