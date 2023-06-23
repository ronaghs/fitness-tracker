// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTgW177DGjosz4EfS0AfDF7cQWY14B1i8",
  authDomain: "fitness-tracker-fa45f.firebaseapp.com",
  projectId: "fitness-tracker-fa45f",
  storageBucket: "fitness-tracker-fa45f.appspot.com",
  messagingSenderId: "728580205579",
  appId: "1:728580205579:web:27c9321df579c91df5ab0e",
  measurementId: "G-3N01HM6KRY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
