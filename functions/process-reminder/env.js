var env = {
  CONTACTS_COLLECTION: "contacts",
  REMINDERS_COLLECTIONS: "reminders",
  USERS_COLLECTIONS: "users",
  PROJECTID: "prm-sosu-tech",
  LOCATION: "us-east1",
  REMINDER_QUEUE: "Contact-Reminders-In-App",
};

var admin = require("firebase-admin");
admin.initializeApp();
var firestore = admin.firestore();
var messaging = admin.messaging();

module.exports = {
  env,
  firestore,
  messaging,
};
