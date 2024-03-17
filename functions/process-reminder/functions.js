const { enqueueTask } = require("./cloudtasks");
var { env, firestore, logger } = require("./env");
const { sendPushNotificationToUser } = require("./fcm");
var {
  getContactById,
  getReminderById,
  getUserById,
  setReminderById,
  getUserByUsername,
} = require("./database-functions");

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

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

async function login(username, requestPassword) {
  var user = await getUserByUsername(username);

  if (user === null) throw "USER_DOES_NOT_EXIST";

  const isPasswordValid = await bcrypt.compare(
    requestPassword,
    user.hashedPassword
  );

  if (!isPasswordValid) throw "INVALID_AUTH";

  const token = jwt.sign({ userId: user.id }, "your-secret-key", {
    expiresIn: "1w",
  });

  return token;
}

module.exports = {
  processReminder,
  login,
};
