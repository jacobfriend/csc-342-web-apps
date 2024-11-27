const express = require("express");
const notificationRouter = express.Router();
const webpush = require("web-push");

const { TokenMiddleware } = require("../middleware/TokenMiddleware");

const vapidKeys = {
  publicKey: process.env.PUSH_PUBLIC_KEY,
  privateKey: process.env.PUSH_PRIVATE_KEY,
};

webpush.setVapidDetails(
  process.env.PUSH_SERVER_ID,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Map's each authenticated user (username: string) to a unique web-push subscription object + notification list
const pushSubscriptions = new Map();

//function to send push notifications
function sendPushNotification(username, title, body) {
  const obj = pushSubscriptions.get(username);
  if (!obj || !obj.subscription) return;

  obj.notifications.push({
    title: title,
    body: body,
  });

  webpush
    .sendNotification(
      obj.subscription,
      JSON.stringify({
        title: title,
        body: body,
      })
    )
    .catch((error) => {
      console.error("Error sending push notification:", error);
      pushSubscriptions.delete(username);
    });
}

// POST route to handle new subscriptions
notificationRouter.post("/subscribe", (req, res) => {
  const { username, subscription } = req.body;

  // Validate subscription data
  if (!username || !subscription) {
    return res
      .status(400)
      .json({ error: "Username and subscription are required" });
  }

  // Store the subscription in the pushSubscriptions object
  pushSubscriptions.set(username, {
    subscription: subscription,
    notifications: [],
  });

  // Debugging: Log the subscription
  console.log(`Stored push subscription for user: ${username}`);

  // Send a successful response
  res.status(200).json({ message: "Subscription successful" });
});

// Route that tests a push notification
notificationRouter.get("/notify", TokenMiddleware, (req, res) => {
  // Send a push notification to all users except the sender
  sendPushNotification(
    req.user.username,
    "Water",
    "Remember to water your plants!"
  );

  // Respond with a success message
  res.status(200).json({ message: "Push notification sent" });
});

notificationRouter.get("/notifications", TokenMiddleware, (req, res) => {
  const obj = pushSubscriptions.get(req.user.username);
  if (!obj) {
    return res.status(404).json({ message: "No notifications found." });
  }

  // Respond with a success message
  res.status(200).json(obj.notifications);
});

notificationRouter.delete(
  "/notifications/:index",
  TokenMiddleware,
  (req, res) => {
    const obj = pushSubscriptions.get(req.user.username);
    const index = req.params.index;
    if (!obj || !index) {
      return res.status(404).json({ message: "No notifications found." });
    }

    if (obj.notifications.length <= 1) {
      obj.notifications = [];
    } else {
      obj.notifications = obj.notifications.splice(index, 1);
    }

    // Respond with a success message
    res.status(200).json(obj.notifications);
  }
);

setInterval(() => {
  pushSubscriptions.forEach(([username, obj]) => {
    sendPushNotification(username, "Water", "Remember to water your plants!");
  });
}, 1000 * 60 * 60 * 24); // Once a day

module.exports = {
  notificationRouter,
  sendPushNotification,
};
