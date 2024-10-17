// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "projview-408d7.firebaseapp.com",
  projectId: "projview-408d7",
  storageBucket: "projview-408d7.appspot.com",
  messagingSenderId: "1030447397422",
  appId: "1:1030447397422:web:f38456f0b8745e7a0d3dbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };