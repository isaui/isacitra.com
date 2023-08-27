// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_SfzhQZo261Z3kBvxNEz2zY1gzKAQ274",
  authDomain: "isa-citra-1691878861005.firebaseapp.com",
  projectId: "isa-citra-1691878861005",
  storageBucket: "isa-citra-1691878861005.appspot.com",
  messagingSenderId: "162707233969",
  appId: "1:162707233969:web:04d90b8885ba8768999690",
  measurementId: "G-ERVNNYPQ3L"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const Storage = getStorage(app)
 const analytics = getAnalytics(app);

export {Storage}
