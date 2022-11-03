// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')
const { getFirestore } = require("firebase/firestore")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb_Pfb4G7A5TBZodaf1CKA6d7LzxmqNDA",
  authDomain: "proyectofinal-f22dd.firebaseapp.com",
  projectId: "proyectofinal-f22dd",
  storageBucket: "proyectofinal-f22dd.appspot.com",
  messagingSenderId: "917402391061",
  appId: "1:917402391061:web:f0f6f1777ad8aff175741c"
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

module.exports = db