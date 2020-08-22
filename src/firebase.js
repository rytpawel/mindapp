import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig =  {
  apiKey: "AIzaSyA9x1dRXdXJ7LmEvpJ8Mnc1n4Zmh-gxokI",
  authDomain: "mindapp-76c92.firebaseapp.com",
  databaseURL: "https://mindapp-76c92.firebaseio.com",
  projectId: "mindapp-76c92",
  storageBucket: "mindapp-76c92.appspot.com",
  messagingSenderId: "574832262224",
  appId: "1:574832262224:web:516e5f3bda4658eb65e555"
};


const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();

export const firestore = app.firestore();
