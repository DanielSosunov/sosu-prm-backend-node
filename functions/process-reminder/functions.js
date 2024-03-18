const { enqueueTask } = require("./cloudtasks");
var { env, logger, firestore } = require("./env");
const { sendPushNotificationToUser } = require("./fcm");
var uuid = require("uuid");
var {
  getContactById,
  getReminderById,
  getUserById,
  setReminderById,
  getUserByUsername,
  setUserById,
} = require("./database-functions");
var { accessSecret } = require("./secretmanager");
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

  //Check if the user does not exist
  if (user === null) throw "USER_DOES_NOT_EXIST";

  //Check if password is valid
  const isPasswordValid = await bcrypt.compare(
    requestPassword,
    user.hashedPassword
  );

  if (!isPasswordValid) throw "INVALID_AUTH";

  //Access Secrets
  var jwtSecret = await accessSecret(env.JWT_SECRET);

  const token = jwt.sign({ userId: user.id }, jwtSecret, {
    expiresIn: "1w",
  });

  //Return the token
  return token;
}

async function signup(username, requestPassword) {
  var user = await getUserByUsername(username);

  //Check if the user exists
  if (user !== null) throw "USER_EXISTS";

  //Generate password hash
  var salt = bcrypt.genSaltSync(10);
  var hashedPass = await bcrypt.hash(requestPassword, salt);

  var userId = uuid.v4();
  //Save password, username, time created
  await setUserById(userId, {
    hashedPassword: hashedPass,
    username,
    createdAt: new Date().getTime(),
  });

  var jwtSecret = await accessSecret(env.JWT_SECRET);

  const token = jwt.sign({ userId: userId }, jwtSecret, {
    expiresIn: "1w",
  });

  return token;
}

async function upsertContact(contactUpdates, id) {
  if (id) {
    await firestore
      .collection(env.CONTACTS_COLLECTION)
      .doc(id)
      .update(contactUpdates);

    return { ...contactUpdates, id };
  } else {
    var contactId = uuid.v4();
    await firestore
      .collection(env.CONTACTS_COLLECTION)
      .doc(contactId)
      .set(contactUpdates);
    return { ...contactUpdates, id: contactId };
  }
}

module.exports = {
  processReminder,
  login,
  signup,
  upsertContact,
};
