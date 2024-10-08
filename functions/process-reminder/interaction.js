const {
  getContactById,
  setContactById,
  setInteractionById,
  getMonthlyInteractionByContactId,
  setInteractionByIdForUser,
  getMonthlyInteractionByUserId,
} = require("./gcp/database-functions");
const uuid = require("uuid");
const { firestore, env } = require("./env");
const logger = require("./tools/logger");

async function addInteraction(contact, contactId, interaction, diary, userId) {
  //Check if contact exists first
  var findContact = await getContactById(contactId);
  if (findContact === null) {
    //If there is no contact create the contact in the db
    await setContactById(contactId, {
      ...contact,
      createdAt: new Date().getTime(),
      userId,
    });
  }

  //Add the interaction
  var interactionId = uuid.v4();
  var timestamp = new Date().toISOString();
  interaction = {
    ...interaction,
    contactId,
    userId,
    timestamp,
  };
  if (diary) interaction.diary = diary;

  await setInteractionById(contactId, interactionId, { ...interaction }); // contacts / contactId / interactions

  await setInteractionByIdForUser(userId, interactionId, interaction); // users/uid/interactions/iid/interaction

  //Append contacts monthy interaction stats -> contacts / contactId /monthly interactions
  await updateContactMonthlyInteractionStats(interaction);

  //Append total contact interaction stats -> total contacts / contactId
  await updateTotalContactInteractionStats(interaction);

  //Append monthly user interaction stats -> user / userId / monthly interactions
  await updateUserMonthlyInteractionStats(interaction);

  //Append total user interaction stats -> total user / user Id
  await updateTotalUserInteractionStats(interaction);

  return interaction;
}

async function updateContactMonthlyInteractionStats(interactionObj) {
  const { contactId, timestamp } = interactionObj;

  // Extract the year and month from the timestamp
  const date = new Date(timestamp);
  const yearMonth = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

  // Reference to the monthly interactions document
  const monthlyInteractionsRef = firestore
    .collection(env.CONTACTS_COLLECTION)
    .doc(contactId)
    .collection(env.CONTACT_MONTHLY_INTERACTIONS_SUBCOLLECTION)
    .doc(yearMonth);

  try {
    // Get the existing monthly interactions document
    const monthlyInteractionsDoc = await monthlyInteractionsRef.get();

    let aggregatedStatsObj;

    if (monthlyInteractionsDoc.exists) {
      // If the document exists, get the existing data
      aggregatedStatsObj = monthlyInteractionsDoc.data();
    } else {
      // If the document doesn't exist, create a new object with initial values
      aggregatedStatsObj = {
        totalInteractions: 0,
        initiatedByMe: 0,
        initiatedByContact: 0,
        interactionTypes: {
          phone: 0,
          inPerson: 0,
          messages: 0,
          other: 0,
        },
        interactionSentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
        interactionPurposes: {
          personal: 0,
          business: 0,
        },
      };
    }

    // Increment total interactions
    aggregatedStatsObj.totalInteractions++;

    // Update initiated by fields
    if (interactionObj.initiatedBy === "contact") {
      aggregatedStatsObj.initiatedByContact++;
    } else if (interactionObj.initiatedBy === "me") {
      aggregatedStatsObj.initiatedByMe++;
    }

    // Update interaction types
    if (interactionObj.type === "phone") {
      aggregatedStatsObj.interactionTypes.phone++;
    } else if (interactionObj.type === "inPerson") {
      aggregatedStatsObj.interactionTypes.inPerson++;
    } else if (interactionObj.type === "message") {
      aggregatedStatsObj.interactionTypes.messages++;
    } else if (interactionObj.type === "other") {
      aggregatedStatsObj.interactionTypes.other++;
    }

    // Update interaction sentiments
    if (interactionObj.sentiment === "positive") {
      aggregatedStatsObj.interactionSentiments.positive++;
    } else if (interactionObj.sentiment === "neutral") {
      aggregatedStatsObj.interactionSentiments.neutral++;
    } else if (interactionObj.sentiment === "negative") {
      aggregatedStatsObj.interactionSentiments.negative++;
    }

    // Update interaction purposes
    if (interactionObj.purpose === "personal") {
      aggregatedStatsObj.interactionPurposes.personal++;
    } else if (interactionObj.purpose === "business") {
      aggregatedStatsObj.interactionPurposes.business++;
    }

    // Save the updated aggregated stats back to Firestore
    await monthlyInteractionsRef.set(aggregatedStatsObj);

    logger.info("Monthly interaction stats updated successfully.");
  } catch (error) {
    logger.error("Error updating monthly interaction stats:", error);
    logger.error(interactionObj);
  }
}

async function updateUserMonthlyInteractionStats(interactionObj) {
  const { userId, timestamp } = interactionObj;

  // Extract the year and month from the timestamp
  const date = new Date(timestamp);
  const yearMonth = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

  // Reference to the monthly interactions document
  const monthlyInteractionsRef = firestore
    .collection(env.USERS_COLLECTIONS)
    .doc(userId)
    .collection(env.USER_MONTHLY_INTERACTIONS_SUBCOLLECTION)
    .doc(yearMonth);

  try {
    // Get the existing monthly interactions document
    const monthlyInteractionsDoc = await monthlyInteractionsRef.get();

    let aggregatedStatsObj;

    if (monthlyInteractionsDoc.exists) {
      // If the document exists, get the existing data
      aggregatedStatsObj = monthlyInteractionsDoc.data();
    } else {
      // If the document doesn't exist, create a new object with initial values
      aggregatedStatsObj = {
        totalInteractions: 0,
        initiatedByMe: 0,
        initiatedByContact: 0,
        interactionTypes: {
          phone: 0,
          inPerson: 0,
          messages: 0,
          other: 0,
        },
        interactionSentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
        interactionPurposes: {
          personal: 0,
          business: 0,
        },
      };
    }

    // Increment total interactions
    aggregatedStatsObj.totalInteractions++;

    // Update initiated by fields
    if (interactionObj.initiatedBy === "contact") {
      aggregatedStatsObj.initiatedByContact++;
    } else if (interactionObj.initiatedBy === "me") {
      aggregatedStatsObj.initiatedByMe++;
    }

    // Update interaction types
    if (interactionObj.type === "phone") {
      aggregatedStatsObj.interactionTypes.phone++;
    } else if (interactionObj.type === "inPerson") {
      aggregatedStatsObj.interactionTypes.inPerson++;
    } else if (interactionObj.type === "message") {
      aggregatedStatsObj.interactionTypes.messages++;
    } else if (interactionObj.type === "other") {
      aggregatedStatsObj.interactionTypes.other++;
    }

    // Update interaction sentiments
    if (interactionObj.sentiment === "positive") {
      aggregatedStatsObj.interactionSentiments.positive++;
    } else if (interactionObj.sentiment === "neutral") {
      aggregatedStatsObj.interactionSentiments.neutral++;
    } else if (interactionObj.sentiment === "negative") {
      aggregatedStatsObj.interactionSentiments.negative++;
    }

    // Update interaction purposes
    if (interactionObj.purpose === "personal") {
      aggregatedStatsObj.interactionPurposes.personal++;
    } else if (interactionObj.purpose === "business") {
      aggregatedStatsObj.interactionPurposes.business++;
    }

    // Save the updated aggregated stats back to Firestore
    await monthlyInteractionsRef.set(aggregatedStatsObj);

    logger.info("Monthly interaction stats updated successfully.");
  } catch (error) {
    logger.error("Error updating monthly interaction stats:", error);
    logger.error(interactionObj);
  }
}

async function updateTotalContactInteractionStats(interactionObj) {
  const { contactId, userId } = interactionObj;

  // Reference to the monthly interactions document
  const totalContactInteractionsRef = firestore
    .collection(env.CONTACT_INTERACTIONS_COLLECTION)
    .doc(contactId);

  try {
    // Get the existing monthly interactions document
    const totalContactInteractionsDoc = await totalContactInteractionsRef.get();

    let aggregatedStatsObj;

    if (totalContactInteractionsDoc.exists) {
      // If the document exists, get the existing data
      aggregatedStatsObj = totalContactInteractionsDoc.data();
    } else {
      // If the document doesn't exist, create a new object with initial values
      aggregatedStatsObj = {
        userId,
        totalInteractions: 0,
        initiatedByMe: 0,
        initiatedByContact: 0,
        interactionTypes: {
          phone: 0,
          inPerson: 0,
          messages: 0,
          other: 0,
        },
        interactionSentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
        interactionPurposes: {
          personal: 0,
          business: 0,
        },
      };
    }

    // Increment total interactions
    aggregatedStatsObj.totalInteractions++;

    // Update initiated by fields
    if (interactionObj.initiatedBy === "contact") {
      aggregatedStatsObj.initiatedByContact++;
    } else if (interactionObj.initiatedBy === "me") {
      aggregatedStatsObj.initiatedByMe++;
    }

    // Update interaction types
    if (interactionObj.type === "phone") {
      aggregatedStatsObj.interactionTypes.phone++;
    } else if (interactionObj.type === "inPerson") {
      aggregatedStatsObj.interactionTypes.inPerson++;
    } else if (interactionObj.type === "message") {
      aggregatedStatsObj.interactionTypes.messages++;
    } else if (interactionObj.type === "other") {
      aggregatedStatsObj.interactionTypes.other++;
    }

    // Update interaction sentiments
    if (interactionObj.sentiment === "positive") {
      aggregatedStatsObj.interactionSentiments.positive++;
    } else if (interactionObj.sentiment === "neutral") {
      aggregatedStatsObj.interactionSentiments.neutral++;
    } else if (interactionObj.sentiment === "negative") {
      aggregatedStatsObj.interactionSentiments.negative++;
    }

    // Update interaction purposes
    if (interactionObj.purpose === "personal") {
      aggregatedStatsObj.interactionPurposes.personal++;
    } else if (interactionObj.purpose === "business") {
      aggregatedStatsObj.interactionPurposes.business++;
    }

    // Save the updated aggregated stats back to Firestore
    await totalContactInteractionsRef.set(aggregatedStatsObj);

    logger.info("total contact interaction stats updated successfully.");
  } catch (error) {
    logger.error("Error updating total contact interaction stats:", error);
    logger.error(interactionObj);
  }
}

async function updateTotalUserInteractionStats(interactionObj) {
  const { userId } = interactionObj;

  // Reference to the monthly interactions document
  const totalUserInteractionsRef = firestore
    .collection(env.USER_INTERACTIONS_COLLECTION)
    .doc(userId);

  try {
    // Get the existing monthly interactions document
    const totalUserInteractionsDoc = await totalUserInteractionsRef.get();

    let aggregatedStatsObj;

    if (totalUserInteractionsDoc.exists) {
      // If the document exists, get the existing data
      aggregatedStatsObj = totalUserInteractionsDoc.data();
    } else {
      // If the document doesn't exist, create a new object with initial values
      aggregatedStatsObj = {
        totalInteractions: 0,
        initiatedByMe: 0,
        initiatedByContact: 0,
        interactionTypes: {
          phone: 0,
          inPerson: 0,
          messages: 0,
          other: 0,
        },
        interactionSentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
        interactionPurposes: {
          personal: 0,
          business: 0,
        },
      };
    }

    // Increment total interactions
    aggregatedStatsObj.totalInteractions++;

    // Update initiated by fields
    if (interactionObj.initiatedBy === "contact") {
      aggregatedStatsObj.initiatedByContact++;
    } else if (interactionObj.initiatedBy === "me") {
      aggregatedStatsObj.initiatedByMe++;
    }

    // Update interaction types
    if (interactionObj.type === "phone") {
      aggregatedStatsObj.interactionTypes.phone++;
    } else if (interactionObj.type === "inPerson") {
      aggregatedStatsObj.interactionTypes.inPerson++;
    } else if (interactionObj.type === "message") {
      aggregatedStatsObj.interactionTypes.messages++;
    } else if (interactionObj.type === "other") {
      aggregatedStatsObj.interactionTypes.other++;
    }

    // Update interaction sentiments
    if (interactionObj.sentiment === "positive") {
      aggregatedStatsObj.interactionSentiments.positive++;
    } else if (interactionObj.sentiment === "neutral") {
      aggregatedStatsObj.interactionSentiments.neutral++;
    } else if (interactionObj.sentiment === "negative") {
      aggregatedStatsObj.interactionSentiments.negative++;
    }

    // Update interaction purposes
    if (interactionObj.purpose === "personal") {
      aggregatedStatsObj.interactionPurposes.personal++;
    } else if (interactionObj.purpose === "business") {
      aggregatedStatsObj.interactionPurposes.business++;
    }

    // Save the updated aggregated stats back to Firestore
    await totalUserInteractionsRef.set(aggregatedStatsObj);

    logger.info("total user interaction stats updated successfully.");
  } catch (error) {
    logger.error("Error updating total user interaction stats:", error);
    logger.error(interactionObj);
  }
}

async function getMonthlyInteractionOfContact(contactId, yearMonth) {
  if (
    yearMonth === undefined ||
    yearMonth === null ||
    yearMonth === `undefined` ||
    yearMonth === `null`
  ) {
    // Extract the year and month from the timestamp
    const date = new Date();
    yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }
  logger.info(`yearMonth`, yearMonth);

  var monthlyInteraction = await getMonthlyInteractionByContactId(
    contactId,
    yearMonth
  );
  return monthlyInteraction ? { ...monthlyInteraction, yearMonth } : null;
}
async function getMonthlyInteractionOfUser(userId, yearMonth) {
  if (
    yearMonth === undefined ||
    yearMonth === null ||
    yearMonth === `undefined` ||
    yearMonth === `null`
  ) {
    // Extract the year and month from the timestamp
    const date = new Date();
    yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }
  logger.info(`yearMonth`, yearMonth);

  var monthlyInteraction = await getMonthlyInteractionByUserId(
    userId,
    yearMonth
  );
  return monthlyInteraction ? { ...monthlyInteraction, yearMonth } : null;
}

module.exports = {
  addInteraction,
  getMonthlyInteractionOfContact,
  getMonthlyInteractionOfUser,
};
