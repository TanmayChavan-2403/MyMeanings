self.addEventListener("push", e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://i.imgur.com/Qdx8HcQ.png",
    badge:"https://i.imgur.com/Qdx8HcQ.png",
    // image: "https://i.imgur.com/7afdk1t.jpeg",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    // actions: [
    //   {action: 'quiz', title:'📚Start the quiz'}
    // ]
  });
  
  self.addEventListener('notificationclick', function (event) {
    // Closing the notificaion
    event.notification.close();

    if (event.action === "quiz"){
      clients.openWindow(data.link);
    } else {
      clients.openWindow(data.link);
    }
    
  });
});