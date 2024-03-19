var env = {
  CONTACTS_COLLECTION: "contacts",
  REMINDERS_COLLECTIONS: "reminders",
  INTERACTIONS_SUBCOLLECTION: "interactions",
  USERS_COLLECTIONS: "users",
  PROJECTID: "prm-sosu-tech",
  LOCATION: "us-east1",
  REMINDER_QUEUE: "Contact-Reminders-In-App",
  JWT_SECRET:
    "projects/87959513719/secrets/sosu-prm-auth-jwt-secret/versions/1",
};

var admin = require("firebase-admin");
admin.initializeApp();
var firestore = admin.firestore();
var messaging = admin.messaging();
var logger = require("log4js").getLogger();

module.exports = {
  env,
  firestore,
  messaging,
  logger,
};
