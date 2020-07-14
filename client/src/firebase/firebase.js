import 'firebase/analytics';
import 'firebase/firestore';
import * as firebase from 'firebase/app';

// Configure Firebase. 
const config = {
  apiKey: "AIzaSyCR9KXK2iDuaZ3n6WNzZnBORbtpgWE7dvI",
  authDomain: "step9-2020-capstone.firebaseapp.com",
  databaseURL: "https://step9-2020-capstone.firebaseio.com",
  projectId: "step9-2020-capstone",
  storageBucket: "step9-2020-capstone.appspot.com",
  messagingSenderId: "809132251307",
  appId: "1:809132251307:web:f4e030446f07e1f9063fee",
  measurementId: "G-GE5SS0J0F4"
};

// Initialize Firebase.
const app = firebase.initializeApp(config);
const database = firebase.firestore();
firebase.analytics();

export { app, database };