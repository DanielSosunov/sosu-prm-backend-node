var env = {
  CONTACTS_COLLECTION: "contacts",
  REMINDERS_COLLECTIONS: "reminders",
  INTERACTIONS_SUBCOLLECTION: "interactions", // Interaction on a single contact
  CONTACT_MONTHLY_INTERACTIONS_SUBCOLLECTION: "contactMonthlyInteractions", // Monthly for the specific contact
  CONTACT_INTERACTIONS_COLLECTION: "contactTotalInteractions", // Total for the contact
  USER_INTERACTIONS_COLLECTION: "userTotalInteractions", // Total for the user
  USER_MONTHLY_INTERACTIONS_SUBCOLLECTION: "userMonthlyInteractions", // Monthly for the specific user
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

module.exports = {
  env,
  firestore,
  messaging,
};
