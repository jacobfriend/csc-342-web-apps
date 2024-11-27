const express = require('express');
const webpush = require('web-push');
const websocketRouter = express.Router();

websocketRouter.use(express.json());
const vapidKeys = {
  publicKey: process.env.PUSH_PUBLIC_KEY,
  privateKey: process.env.PUSH_PRIVATE_KEY
};
webpush.setVapidDetails(process.env.PUSH_SERVER_ID, vapidKeys.publicKey, vapidKeys.privateKey);

const pushSubscriptions = {};

/***********\
* WEBSOCKET *
\***********/

//Store chat messages in memory
const messages = [];
//Keep track of connected clients
const clients = new Set();

function sendPacket(ws, label, data) {
  let packet = {
    label: label,
    data: data
  }
  ws.send(JSON.stringify(packet));
}

websocketRouter.ws('/ws', (ws, req) => {
  clients.add(ws);
  console.log('New client');
  sendPacket(ws, 'init', messages);

  ws.on('close', e => {
    clients.delete(ws);
    console.log('client closed');
  });
  
  ws.on('message', (msg) => {
    const packet = JSON.parse(msg);
    switch(packet.label) {
      case 'chat':
        sendPush(packet.data.name, packet.data.message);  
        messages.push(packet.data);
        clients.forEach(client => {
          if(client !== ws) {
            client.send(msg);
          }
        });
        break;
    }
  });
});



/********************\
* PUSH NOTIFICATIONS *
\********************/

// ADD YOUR CODE HERE

websocketRouter.post('/subscribe', (req, res) => {
  console.log(req.body);
  pushSubscriptions[req.body.username] = req.body.subscription;
  res.status(200).json({msg: 'Subscription successful'});
});

function sendPush(username, message) {
  for (const subscribedName in pushSubscriptions) {
    // Code to send a push notification to the user
    if (subscribedName == username) {
      continue;
    }
    const subscription = pushSubscriptions[subscribedName];
    webpush.sendNotification(subscription, JSON.stringify({
      title: username, // Set the sender as the title of the notification
      body: message // Set the chat message as the body of the notification
    }));
  }
}

module.exports = websocketRouter;
