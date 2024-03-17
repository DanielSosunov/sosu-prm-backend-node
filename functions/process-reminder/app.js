const express = require("express");
const bodyParser = require("body-parser");
var { logRequestDetails } = require("./middleware");
const { processReminder, login, signup } = require("./functions");
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
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
  }
  res.json({ reminder: newReminderObject });
});

app.post("/auth/login", async (req, res) => {
  // Logic to create a new contact in Firestore or another database
  const { username, password } = req.body;
  logger.debug(`Logging in ${username}`);
  try {
    var loginToken = await login(username, password);
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
  }
  res.json({ token: loginToken });
});

app.post("/auth/signup", async (req, res) => {
  // Logic to create a new contact in Firestore or another database
  const { username, password } = req.body;
  logger.debug(`Sign up ${username}`);
  try {
    var loginToken = await signup(username, password);
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
  }
  res.json({ token: loginToken });
});

// Define other endpoints (PUT, DELETE, etc.) as needed

module.exports = {
  app,
};
