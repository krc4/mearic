
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


// Initialize Firebase for client components
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { db, auth };
