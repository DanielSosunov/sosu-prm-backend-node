var { env, firestore } = require("./env");

async function getReminderById(reminderId) {
  var reminder = await firestore
    .collection(env.REMINDERS_COLLECTIONS)
    .doc(reminderId)
    .get();
  if (!reminder.exists) {
    return null;
  }
  return reminder.data();
}

async function getContactById(contactId) {
  var contact = await firestore
    .collection(env.CONTACTS_COLLECTION)
    .doc(contactId)
    .get();
  if (!contact.exists) {
    return null;
  }
  return contact.data();
}

async function getUserById(userId) {
  var user = await firestore
    .collection(env.USERS_COLLECTIONS)
    .doc(userId)
    .get();
  if (!user.exists) {
    return null;
  }
  return user.data();
}

async function getUserByUsername(username) {
  const usersSnapshot = await firestore
    .collection(env.USERS_COLLECTIONS)
    .where("username", "==", username)
    .get();

  var users = [];
  usersSnapshot.forEach((doc) => {
    // Get the data from each document
    const userData = doc.data();
    // Add the user data to the array
    users.push({
      ...userData,
      id: doc.id,
    });
  });

  if (users.length > 0) return users[0];
  return null;
}

async function setReminderById(reminderId, updates) {
  return firestore
    .collection(env.REMINDERS_COLLECTIONS)
    .doc(reminderId)
    .set(updates);
}

async function setContactById(contactId, updates) {
  return firestore
    .collection(env.CONTACTS_COLLECTION)
    .doc(contactId)
    .set(updates);
}

async function setInteractionById(contactId, interactionId, updates) {
  return firestore
    .collection(env.CONTACTS_COLLECTION)
    .doc(contactId)
    .collection(env.INTERACTIONS_SUBCOLLECTION)
    .doc(interactionId)
    .set(updates);
}

async function updateUserById(uid, updates) {
  return firestore.collection(env.USERS_COLLECTIONS).doc(uid).update(updates);
}

async function setUserById(uid, data) {
  return firestore.collection(env.USERS_COLLECTIONS).doc(uid).set(data);
}

module.exports = {
  getUserById,
  getContactById,
  getReminderById,
  setReminderById,
  getUserByUsername,
  setUserById,
  updateUserById,
  setContactById,
  setInteractionById,
};
