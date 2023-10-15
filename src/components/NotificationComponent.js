import React, { useState } from 'react'

export default function NotificationComponent() {
  const [permission, setPermission] = useState(Notification.permission);

  const handleRequestPermission = () => {
    Notification.requestPermission().then(permission => setPermission(permission));
  };

  const handleShowNotification = () => {
    new Notification('Hello, world!', {
      body: 'This is a notification',
      // you can add more options here
    });
  };

  return (
    <div>
      {permission === 'granted' ? (
        <button onClick={handleShowNotification}>Show Notification</button>
      ) : (
        <button onClick={handleRequestPermission}>Request Permission</button>
      )}
    </div>
  );
}