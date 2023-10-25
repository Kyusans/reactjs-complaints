export function handleShowNotification() {
  const notification = new Notification("New Complaint", { body: "A new complaint has been submitted. Please review it." });
  notification.onclick = () => {
    window.open("http://192.168.1.5:3000/admin/dashboard");
  };
}
function NotificationComponent() {
  return (
    <>
      notify
    </>
  )
}
export default NotificationComponent