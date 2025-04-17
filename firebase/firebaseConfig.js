// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_H9yW0iMRjGaiDFsfBqdnLHS0DV96c0w",
  authDomain: "shopping-app-7a4e7.firebaseapp.com",
  projectId: "shopping-app-7a4e7",
  storageBucket: "shopping-app-7a4e7.firebasestorage.app",
  messagingSenderId: "932354829760",
  appId: "1:932354829760:web:c50e9beb05c5a61cccec25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
