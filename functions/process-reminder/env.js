var env = {
    CONTACTS_COLLECTION: "contacts",
    REMINDERS_COLLECTIONS: "reminders"
}

var admin = require('firebase-admin')
var firestore = admin.firestore()

module.exports = {
    env,
    firestore
}