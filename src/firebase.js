import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAf6H247ZVX96CR5v0lBFi6zzAsHH8F9DA",
  authDomain: "flack-21ea5.firebaseapp.com",
  databaseURL: "https://flack-21ea5.firebaseio.com",
  projectId: "flack-21ea5",
  storageBucket: "flack-21ea5.appspot.com",
  messagingSenderId: "107690838369",
  appId: "1:107690838369:web:fbe59e38629b5024f7dd20",
  measurementId: "G-X604EE288Q",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
