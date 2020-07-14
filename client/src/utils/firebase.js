import firebase from 'firebase';

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
firebase.initializeApp(config);

export default firebase;

// const sampleDoc = streamAds();

// export { states, sampleDoc };