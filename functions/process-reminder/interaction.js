const {
  getContactById,
  setContactById,
  setInteractionById,
} = require("./database-functions");
const uuid = require("uuid");

async function addInteraction(contact, contactId, interaction, userId) {
  //Check if contact exists first
  var findContact = await getContactById(contactId);
  if (findContact === null) {
    //If there is no contact create the contact in the db
    contactId = uuid.v4();
    await setContactById(contactId, {
      ...contact,
      createdAt: new Date().getTime(),
      userId,
    });
  }

  //Add the interaction
  var interactionId = uuid.v4();
  await setInteractionById(contactId, interactionId, {
    contactId,
    userId,
    timestamp: new Date().toISOString(),
    ...interaction,
  });

  //Append analytics
}

module.exports = {
  addInteraction,
};
