// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-L2Xc7fkzF3WghrLlnLWY0z923Z9zj3E",
    authDomain: "fuldozzer.firebaseapp.com",
    projectId: "fuldozzer",
    storageBucket: "fuldozzer.appspot.com",
    messagingSenderId: "28118926559",
    appId: "1:28118926559:web:c42fafef89c77d84b5956a",
    measurementId: "G-2BLJE58YGQ"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);