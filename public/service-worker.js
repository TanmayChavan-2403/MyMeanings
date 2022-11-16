function checkForFlag(flag){
  if (flag){
    return [{action: 'revise', title:'Click here to visit.'}]
  } else {
    return null
  }
}

self.addEventListener("push", e => {
  const data = e.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://i.imgur.com/Qdx8HcQ.png",
    badge:"https://i.imgur.com/Qdx8HcQ.png",
    actions: checkForFlag(data.flag),
  });
  
  self.addEventListener('notificationclick', function (event) {
    // Closing the notificaion
    if (event.action === "revise"){
      clients.openWindow(data.link);
      event.notification.close();
    }
  });
  
});