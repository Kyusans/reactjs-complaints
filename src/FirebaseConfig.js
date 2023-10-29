import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC2EcEP_oXG71Onmbcd01yx5hKplD0zNRg",
  authDomain: "reactjs-gsd.firebaseapp.com",
  projectId: "reactjs-gsd",
  storageBucket: "reactjs-gsd.appspot.com",
  messagingSenderId: "711406156412",
  appId: "1:711406156412:web:e4c9df5a07a6e8dd1b27f9",
  measurementId: "G-L19TVGN09J"
};

export const requestPermission = () =>{
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const app = initializeApp(firebaseConfig);

      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey:
          "BC54dWEz-0ahzWV7mh-gziq5zLvUqEOeJjEs7uFuaqLmt_gOURmJTw367eVaxq3OtSIbX_S7CpONy6DeKfcMzV0",
      }).then((currentToken) => {
        if (currentToken) {
          insertToken(currentToken);
        } else {
          console.log("Can not get token");
        }
      });
    } else {
      console.log("Do not have permission!");
    }
  });
}

const insertToken = async (currentToken) => {
  try{
    const url = localStorage.getItem("url") + "users.php";
    const userId = localStorage.getItem("userId");
    const jsonData = {userId: userId, token: currentToken};
    const formData = new FormData();
    // console.log("url: " + url, "\njsonData: " + JSON.stringify(jsonData), "\ntoken: " + currentToken);
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "insertToken");

    const res = await axios({url: url, data: formData, method: "post"});
    if(res.data === 1){
      console.log("Successfully added the token to the database");
    }else{
      console.log("unsuccessful insert token, res: " , JSON.stringify(res.data))
    }
  }catch(err){
    alert("There was an error: " + err);
  }
}

// import axios from 'axios';
// import { initializeApp } from 'firebase/app';
// import 'firebase/messaging';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// const firebaseConfig = {
//   apiKey: "AIzaSyC2EcEP_oXG71Onmbcd01yx5hKplD0zNRg",
//   authDomain: "reactjs-gsd.firebaseapp.com",
//   projectId: "reactjs-gsd",
//   storageBucket: "reactjs-gsd.appspot.com",
//   messagingSenderId: "711406156412",
//   appId: "1:711406156412:web:e4c9df5a07a6e8dd1b27f9",
//   measurementId: "G-L19TVGN09J"
// }

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// export const requestPermission = () =>{
//   Notification.requestPermission().then(permission => {
//     if(permission === "granted"){
//       return getToken(messaging, {
//         vapidKey: "BC54dWEz-0ahzWV7mh-gziq5zLvUqEOeJjEs7uFuaqLmt_gOURmJTw367eVaxq3OtSIbX_S7CpONy6DeKfcMzV0"
//       }).then((token) => {
//         insertToken(token);
//       }).catch((err) =>{
//         console.log("Error inserting token: " + err);
//       })
//     }
//   })
// }

// const insertToken = async (currentToken) => {
//   try{
//     const url = localStorage.getItem("url") + "users.php";
//     const userId = localStorage.getItem("userId");
//     const jsonData = {userId: userId, token: currentToken};
//     const formData = new FormData();
//     console.log("url: " + url, "\njsonData: " + JSON.stringify(jsonData), "\ntoken: " + currentToken);
//     formData.append("json", JSON.stringify(jsonData));
//     formData.append("operation", "insertToken");

//     const res = await axios({url: url, data: formData, method: "post"});
//     if(res.data === 1){
//       console.log("Successfully added the token to the database");
//     }else{
//       console.log("unsuccessful insert token, res: " , JSON.stringify(res.data))
//     }
//   }catch(err){
//     alert("There was an error: " + err);
//   }
// }
// export const onMessageListener = () =>
//   new Promise(resolve =>{
//     onMessage(messaging, payload =>{
//       resolve(payload);
//     })
//   })