const express = require("express");
const bodyParser = require("body-parser");
var { logRequestDetails } = require("./middleware");
const {
  processReminder,
  login,
  signup,
  upsertContact,
} = require("./functions");
var { logger } = require("./env");

const app = express();
app.use(bodyParser.json());
app.use(logRequestDetails);

logger.level = "info";

app.post("/reminder-feature", async (req, res) => {
  // Logic to create a new contact in Firestore or another database
  const { reminderId } = req.body;
  logger.debug(`Processing ${reminderId}`);
  try {
    var newReminderObject = await processReminder(reminderId);
    res.json({ reminder: newReminderObject });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    res.status(404).send({ error: "An error has occured" });
  }
});

app.post("/auth/login", async (req, res) => {
  // Logic to create a new contact in Firestore or another database
  const { username, password } = req.body;
  logger.debug(`Logging in ${username}`);
  try {
    var loginToken = await login(username, password);
    res.json({ token: loginToken });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    res.status(404).send({ error: "An error has occured" });
  }
});

app.post("/auth/signup", async (req, res) => {
  // Logic to create a new contact in Firestore or another database
  const { username, password } = req.body;
  logger.debug(`Sign up ${username}`);
  try {
    var loginToken = await signup(username, password);
    res.json({ token: loginToken });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    res.status(404).send({ error: "An error has occured" });
  }
});

app.post("/contacts/", async (req, res) => {
  // Logic to create a new contact in Firestore or another database
  const { contactUpdates, id } = req.body;
  logger.debug(`contacts: Updating ${id || "new contact"}`);
  try {
    var contact = await upsertContact(contactUpdates, id);
    res.json({ contact });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    res.status(404).send({ error: "An error has occured" });
  }
});

// Define other endpoints (PUT, DELETE, etc.) as needed

module.exports = {
  app,
};
