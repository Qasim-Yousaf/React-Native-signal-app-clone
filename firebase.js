import * as firebase from "firebase";

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdjz4lg8KTWiUxXr_KBB93blO-SCwyCM4",
  authDomain: "signal-9ff0c.firebaseapp.com",
  projectId: "signal-9ff0c",
  storageBucket: "signal-9ff0c.appspot.com",
  messagingSenderId: "813230242256",
  appId: "1:813230242256:web:3d6d873745a3aad3b1a1d5",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = app.auth();

export { db, auth };
