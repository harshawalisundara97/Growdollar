// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbbTX5Ujmawy7U8zxP7QWweyL82PJLZJw",
  authDomain: "growdoller.firebaseapp.com",
  projectId: "growdoller",
  storageBucket: "growdoller.firebasestorage.app",
  messagingSenderId: "1023566311851",
  appId: "1:1023566311851:web:c781d67c3d85c41183e2ee",
  measurementId: "G-VT90SZ4SWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);