self.addEventListener("push", e => {
    const data = e.data.json();

    self.registration.showNotification(data.title, {
        body: data.body,
        actions: [{
            action: 'revise',
            title: 'Click to revicse more',
            icon: "https://i.imgur.com/Qdx8HcQ.png"
        }],
        requireInteractions: true,
        icon: "https://i.imgur.com/Qdx8HcQ.png",
        badge:"https://i.imgur.com/Qdx8HcQ.png",
    });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    
    if (event.action === 'revise'){
      event.waitUntil(
        clients.openWindow('https://www.youtube.com/')
      )
    }
})