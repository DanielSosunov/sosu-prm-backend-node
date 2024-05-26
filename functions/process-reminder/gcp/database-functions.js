var { env, firestore } = require("../env");

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
  return { ...contact.data(), id: contactId };
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

async function getMonthlyInteractionByContactId(contactId, yearMonth) {
  var monthlyInteraction = await firestore
    .collection(env.CONTACTS_COLLECTION)
    .doc(contactId)
    .collection(env.CONTACT_MONTHLY_INTERACTIONS_SUBCOLLECTION)
    .doc(yearMonth)
    .get();

  if (!monthlyInteraction.exists) {
    return null;
  }

  return monthlyInteraction.data();
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
async function setInteractionByIdForUser(userId, interactionId, updates) {
  return firestore
    .collection(env.USERS_COLLECTIONS)
    .doc(userId)
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

async function getContactInteractionById_doc(contactId, interactionId) {
  var interaction = await firestore
    .collection(env.CONTACTS_COLLECTION)
    .doc(contactId)
    .collection(env.INTERACTIONS_SUBCOLLECTION)
    .doc(interactionId)
    .get();
  if (!interaction.exists) {
    return null;
  }
  return interaction;
}
async function getInteractionOfUserByInteractionId(userId, interactionId) {
  var interaction = await firestore
    .collection(env.USERS_COLLECTIONS)
    .doc(userId)
    .collection(env.INTERACTIONS_SUBCOLLECTION)
    .doc(interactionId)
    .get();
  if (!interaction.exists) {
    return null;
  }
  return interaction;
}
async function getInteractions_paginated(contactId, startAfter) {
  let query = firestore
    .collection(env.CONTACTS_COLLECTION)
    .doc(contactId)
    .collection(env.INTERACTIONS_SUBCOLLECTION)
    .orderBy("timestamp", "desc")
    .limit(5);

  if (startAfter) {
    const doc = await getContactInteractionById_doc(contactId, startAfter);
    if (!doc.exists) throw "PAGINATED_DOCUMENT_DOES_NOT_EXIST";
    query = query.startAfter(doc);
  }

  const snapshot = await query.get();
  const interactions = [];
  let lastVisible = null;

  snapshot.forEach((doc) => {
    interactions.push({ id: doc.id, ...doc.data() });
    lastVisible = doc;
  });

  //Set lastvisible to null if the elements are not 10.
  if (interactions.length < 5) lastVisible = null;

  return { interactions, lastVisible: lastVisible ? lastVisible.id : null };
}
async function getInteractionsByUser_paginated(userId, contactId, startAfter) {
  console.log(`Paginated Interactions Call`, userId, contactId, startAfter);
  let query = firestore
    .collection(env.USERS_COLLECTIONS)
    .doc(userId)
    .collection(env.INTERACTIONS_SUBCOLLECTION);

  if (contactId) query = query.where("contactId", "==", contactId);

  query = query.orderBy("timestamp", "desc").limit(5);

  if (startAfter) {
    const doc = await getInteractionOfUserByInteractionId(userId, startAfter);
    if (!doc.exists) throw "PAGINATED_DOCUMENT_DOES_NOT_EXIST";
    query = query.startAfter(doc);
  }

  const snapshot = await query.get();
  const interactions = [];
  let lastVisible = null;

  snapshot.forEach((doc) => {
    interactions.push({ id: doc.id, ...doc.data() });
    lastVisible = doc;
  });

  //Set lastvisible to null if the elements are not 10.
  if (interactions.length < 5) lastVisible = null;

  return { interactions, lastVisible: lastVisible ? lastVisible.id : null };
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
  getMonthlyInteractionByContactId,
  getInteractions_paginated,
  setInteractionByIdForUser,
  getInteractionsByUser_paginated,
};
