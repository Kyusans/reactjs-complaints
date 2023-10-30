// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/10.0.1/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/10.0.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyC2EcEP_oXG71Onmbcd01yx5hKplD0zNRg",
  authDomain: "reactjs-gsd.firebaseapp.com",
  projectId: "reactjs-gsd",
  storageBucket: "reactjs-gsd.appspot.com",
  messagingSenderId: "711406156412",
  appId: "1:711406156412:web:e4c9df5a07a6e8dd1b27f9",
  measurementId: "G-L19TVGN09J"
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload){
  console.log("Revieved background message:: " + payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(notificationTitle, notificationOptions);
})


// import { getMessaging } from "firebase/messaging/sw";
// import { onBackgroundMessage } from "firebase/messaging/sw";

// const messaging = getMessaging();
// onBackgroundMessage(messaging, (payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });