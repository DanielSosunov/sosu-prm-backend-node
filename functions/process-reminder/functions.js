
var { env, firestore } = require('./env')


async function getReminderById(reminderId) {
    var reminder = await firestore.collection(env.REMINDERS_COLLECTIONS).doc(reminderId).get()
    if (!reminder.exists) {
        throw 'reminder does not exist ${reminderId}'
    }
    return reminder.data()
}

async function getContactById(contactId) {
    var contact = await firestore.collection(env.CONTACTS_COLLECTION).doc(contactId).get()
    if (!contact.exists) {
        throw 'reminder does not exist ${contactId}'
    }
    return reminder.data()
}

async function processReminder(reminderId) {
    var reminder = await getReminderById(reminderId)
    var contactId = reminder.contactId
    var contact = await getContactById(contactId)

    //NOTIFICATION LOGIC

    //NEXT TIME LOGIC

    //RETURN LOGIC, STILL UNSURE
    return reminder
}

module.exports = {
    getReminderById
}