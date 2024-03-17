var { env, firestore } = require("./env");

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
    .update(updates);
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
};
