const myName = localStorage.getItem('name');

/*****\
* GUI *
\*****/

function testNotification(titleText, bodyText) {
  console.log('Test notification');
  const options = {
    body: bodyText,
    icon: '/img/chat-icon.svg'
  };
  const notification = new Notification(titleText, options);
  console.log(notification);
}

const notifyButton = document.querySelector("#notify");
notifyButton.addEventListener("click", () => {
  if (Notification.permission === 'granted') {
    console.log(Notification.permission);
    testNotification("Test Chat Notification", "This is a test notification. We already have permission to show these.");
    return;
  }
  // If permission is not granted
  Notification.requestPermission().then((permission) => {
    console.log(permission);
    if (permission === 'granted') {
      testNotification("Example Chat Notification", "This is what a notification will look like.");
    }
  });
});


const btnSubscribe = document.querySelector("#subscribe");
btnSubscribe.addEventListener('click', (event) => {
  // Send the subscription details to the server
  // The existing subscriptions will be sent in case it changed
  // We're sending the name of the user to identify the subscription
  subscribeToPush(myName);
});

/********************\
* PUSH NOTIFICATIONS *
\********************/

const PUSH_PUBLIC_KEY = 'BNXrCSk2GYfloxkbtlOQ5JHB3W3suE37nWU0f92hBlP1NQ9gyeupKK46jK3kHXclHu7aJcaoYG47paqu2TwwZ9Y';

function subscribeToPush(name) {
  if (!navigator.serviceWorker) { // Are SWs supported?
    return;
  }
  navigator.serviceWorker.ready.then(registration => {
    // Code to obtain a subscription to push notifications
    return registration.pushManager.getSubscription()
      .then(existingSubscription => {
        if (existingSubscription) {
          return existingSubscription;
        }
        // If no existing subscription, return a new one
        return registration.pushManager.subscribe({
          userVisibleOnly: true, //Our push notifications will be visible to the user
          applicationServerKey: PUSH_PUBLIC_KEY
        });
    });
  }).then(subscription => {
    // Code to send the subscription to the server
    fetch('./subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: name, subscription: subscription })
    });
  }).catch(error => {
    console.error(`Subscription failed with error: ${error}`);
  });
};
