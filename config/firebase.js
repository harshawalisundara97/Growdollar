import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbbTX5Ujmawy7U8zxP7QWweyL82PJLZJw",
  authDomain: "growdoller.firebaseapp.com",
  projectId: "growdoller",
  storageBucket: "growdoller.firebasestorage.app",
  messagingSenderId: "1023566311851",
  appId: "1:1023566311851:web:c781d67c3d85c41183e2ee",
  measurementId: "G-VT90SZ4SWV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
