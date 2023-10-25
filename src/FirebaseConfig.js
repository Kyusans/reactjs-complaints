import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyC2EcEP_oXG71Onmbcd01yx5hKplD0zNRg",
  authDomain: "reactjs-gsd.firebaseapp.com",
  projectId: "reactjs-gsd",
  storageBucket: "reactjs-gsd.appspot.com",
  messagingSenderId: "711406156412",
  appId: "1:711406156412:web:e4c9df5a07a6e8dd1b27f9",
  measurementId: "G-L19TVGN09J"
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();