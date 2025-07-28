
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC4UHpyAq3PLgghN0PLv3JdeBok_y6vv60",
  authDomain: "nurunyolu.firebaseapp.com",
  projectId: "nurunyolu",
  storageBucket: "nurunyolu.appspot.com",
  messagingSenderId: "1098560766367",
  appId: "1:1098560766367:web:da721d069f5229ba973daa"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { app, db, auth };
