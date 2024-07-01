// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChNCiUn25W5hemdrWhPNStTwId5dvYRyc",
  authDomain: "qtoa-mern.firebaseapp.com",
  projectId: "qtoa-mern",
  storageBucket: "qtoa-mern.appspot.com",
  messagingSenderId: "845097500547",
  appId: "1:845097500547:web:db05bdf04091e5434740b6",
  measurementId: "G-SZ0Q8GHDEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export{auth,provider}
