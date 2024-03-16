const { enqueueTask } = require("./cloudtasks");
var { env, firestore, logger } = require("./env");
const { sendPushNotificationToUser } = require("./fcm");

async function getReminderById(reminderId) {
  var reminder = await firestore
    .collection(env.REMINDERS_COLLECTIONS)
    .doc(reminderId)
    .get();
  if (!reminder.exists) {
    throw "reminder does not exist ${reminderId}";
  }
  return reminder.data();
}

async function getContactById(contactId) {
  var contact = await firestore
    .collection(env.CONTACTS_COLLECTION)
    .doc(contactId)
    .get();
  if (!contact.exists) {
    throw "contact does not exist ${contactId}";
  }
  return contact.data();
}

async function getUserById(userId) {
  var user = await firestore
    .collection(env.USERS_COLLECTIONS)
    .doc(userId)
    .get();
  if (!user.exists) {
    throw "user does not exist ${userId}";
  }
  return user.data();
}

async function setReminderById(reminderId, updates) {
  return firestore
    .collection(env.REMINDERS_COLLECTIONS)
    .doc(reminderId)
    .update(updates);
}

async function processReminder(reminderId) {
  var timeNow = new Date().getTime();

  logger.debug(`Processing Reminder`);
  var reminder = await getReminderById(reminderId);
  var promises = [
    getContactById(reminder.contactId),
    getUserById(reminder.userId),
  ];
  var [contact, user] = await Promise.all(promises);

  //NOTIFICATION LOGIC
  logger.debug(`Notification Logic`, reminder, user, contact);
  user.fcmToken = "SAMPLE_FCM_TOKEN".repeat(38); // Adjust the length as needed, test fcm token
  await sendPushNotificationToUser(
    user.fcmToken,
    `Stay in touch with ${contact.name}`,
    `Hi ${user.name}, don't forget to stay in touch with ${contact.name}`
  );
  await setReminderById(reminderId, { lastNotificationDate: timeNow });

  //NEXT TIME LOGIC
  logger.debug(`Generating Next Scheduled Time Logic`);
  var nextReminderTime = reminder.frequency + timeNow;
  var nextReminderDate = new Date(nextReminderTime).toISOString();

  //Enqueue task Logic
  logger.debug(`Enqueueing Task`);
  await enqueueTask(reminderId, nextReminderDate);

  //RETURN LOGIC, STILL UNSURE
  return {
    ...reminder,
    lastNotificationDate: timeNow,
  };
}

module.exports = {
  getReminderById,
  processReminder,
};
