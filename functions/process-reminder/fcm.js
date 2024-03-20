var { messaging } = require("./env");
const logger = require("./logger");

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
    logger.info("Push notification sent successfully.");
  } catch (error) {
    logger.error("Error sending push notification:", error, error.stack);
  }
}

module.exports = { sendPushNotificationToUser };
