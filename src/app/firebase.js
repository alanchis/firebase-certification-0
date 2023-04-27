// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4v56Pz25CMNItxbKeh_f0Tvt6GUzjANM",
  authDomain: "probando0104.firebaseapp.com",
  databaseURL: "https://probando0104-default-rtdb.firebaseio.com",
  projectId: "probando0104",
  storageBucket: "probando0104.appspot.com",
  messagingSenderId: "789152623125",
  appId: "1:789152623125:web:662d1b3e4ed9a556c13c1c",
  measurementId: "G-8H647XTDXC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
