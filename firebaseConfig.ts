// =================================================================================
// IMPORTANT: FIREBASE CONFIGURATION
// =================================================================================
// This file sets up the connection to your Firebase project.
//
// HOW TO USE:
// 1. Go to your Firebase project console.
// 2. Go to Project Settings (click the gear icon).
// 3. In the "General" tab, scroll down to "Your apps".
// 4. Find your web app and look for "Firebase SDK snippet".
// 5. Select the "Config" option.
// 6. Copy the entire 'firebaseConfig' object and paste it below, replacing the
//    placeholder values.
//
// These keys are NOT secrets. They are safe to be in your public-facing code.
// For security, make sure to configure "Authorized domains" in the Firebase
// Authentication -> Settings -> Authorized domains section of your Firebase console.
// Add your custom domain name there.
// =================================================================================

//. TEMPLATE FILE 
// =================================================================================

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// const firebaseConfig = {
//   apiKey: "PASTE_YOUR_API_KEY_HERE",
//   authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
//   projectId: "PASTE_YOUR_PROJECT_ID_HERE",
//   storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
// messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
// appId: "PASTE_YOUR_APP_ID_HERE"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// Export the auth service to be used in the application
// export const auth = getAuth(app);


// =================================================================================


// Import the functions you need from the SDKs you need
// FIX: Replaced local firebase imports with CDN URL imports to fix module resolution errors.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2LjRIPb5Q0urmQkhASrZ_An8515lQTOc",
  authDomain: "mywebsite-purushothammuktha.firebaseapp.com",
  projectId: "mywebsite-purushothammuktha",
  storageBucket: "mywebsite-purushothammuktha.firebasestorage.app",
  messagingSenderId: "713181800941",
  appId: "1:713181800941:web:d264f671d83cbd00c0dfe4",
  measurementId: "G-Q3QC44CN6H"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth service to be used in the application
export const auth = getAuth(app);
