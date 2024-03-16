var { messaging, logger } = require("./env");

// Function to send push notification to a specific user
async function sendPushNotificationToUser(fcmToken, title, message) {
  try {
    await messaging.send({
      token: fcmToken,
      notification: {
        title: title,
        body: message,
      },
    });
    logger.debug("Push notification sent successfully.");
  } catch (error) {
    console.error("Error sending push notification:", error, error.stack);
  }
}

module.exports = { sendPushNotificationToUser };
