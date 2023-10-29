// import { useEffect } from "react";
// import { onMessageListener} from "../FirebaseConfig";

// export function handleShowNotification() {
//   const notification = new Notification("New Complaint", { body: "A new complaint has been submitted. Please review it." });
//   notification.onclick = () => {
//     window.open("http://192.168.1.5:3000/admin/dashboard");
//   };
// }

// function NotificationComponent() {
//   useEffect(() => {
//     const unsubscribe = onMessageListener().then((payload) => {
//       const notification = new Notification("New Complaint", { body: "A new complaint has been submitted. Please review it." });
//       notification.onclick = () => {
//         window.open("http://localhost:3000/admin/dashboard");
//       };
//     });
  
//     return () => {
//       unsubscribe.catch(err => console.log("failed to unsubscribe: " + err));
//     }
//   }, [])
//   return (
//     <div>{handleShowNotification}</div>
//   )
// }
// export default NotificationComponent
