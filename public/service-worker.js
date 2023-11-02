// eslint-disable-next-line no-restricted-globals
self.addEventListener("push", (event) =>{

  //{"title": "hello", "body":"hello body"}
  const notification = event.data.json();

  // eslint-disable-next-line no-restricted-globals
  event.waitUntil(self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: "./coclogo.jpg",
    data: {
      notifURL: notification.url
    }
  }));
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("notificationclick", (event) =>{
  // eslint-disable-next-line no-undef
  event.waitUntil(clients.openWindow(event.notification.data.notifURL));
});