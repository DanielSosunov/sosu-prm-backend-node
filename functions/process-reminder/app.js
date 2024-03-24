const express = require("express");
const bodyParser = require("body-parser");
var {
  logRequestDetails,
  verifyTokenMiddleware,
} = require("./tools/middleware");
const { processReminder, login, signup } = require("./functions");
const logger = require("./tools/logger");
const { addInteraction } = require("./interaction");
const { getUserById, updateUserById } = require("./gcp/database-functions");

const app = express();
app.use(bodyParser.json());
app.use(logRequestDetails);

function createResponse(
  data,
  statusCode = 200,
  success = true,
  message = null
) {
  return {
    data,
    statusCode,
    success,
    message,
  };
}

function sendResponse(
  res,
  data,
  statusCode = 200,
  success = true,
  message = null
) {
  const response = createResponse(data, statusCode, success, message);
  res.status(statusCode).json(response);
}

// logger.level = "info";

app.post("/reminder-feature", async (req, res) => {
  // Reminder Feature
  const { reminderId } = req.body;
  logger.info(`Processing ${reminderId}`);
  try {
    var newReminderObject = await processReminder(reminderId);
    sendResponse(res, { reminder: newReminderObject });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    sendResponse(res, null, 404, false, "An error has occured");
  }
});

app.post("/auth/login", async (req, res) => {
  // login
  const { username, password } = req.body;
  logger.info(`Logging in ${username}`);
  try {
    var loginToken = await login(username, password);
    sendResponse(res, { token: loginToken });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    sendResponse(res, null, 404, false, "An error has occured");
  }
});

app.post("/auth/signup", async (req, res) => {
  // Sign up
  const { username, password } = req.body;
  logger.info(`Sign up ${username}`);
  try {
    var loginToken = await signup(username, password);
    sendResponse(res, { token: loginToken });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    sendResponse(res, null, 404, false, "An error has occured");
  }
});

app.post("/interaction/", verifyTokenMiddleware, async (req, res) => {
  // Creating an interaction
  const { contact, contactId, interaction } = req.body;
  try {
    var interactionObj = await addInteraction(
      contact,
      contactId,
      interaction,
      req.userId
    );
    sendResponse(res, { interaction: interactionObj });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    sendResponse(res, null, 404, false, "An error has occured");
  }
});

app.get("/user/", verifyTokenMiddleware, async (req, res) => {
  //Pulling user information
  const { userId } = req;
  try {
    var user = await getUserById(userId);
    sendResponse(res, { user });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    sendResponse(res, null, 404, false, "An error has occured");
  }
});

app.post("/user/", verifyTokenMiddleware, async (req, res) => {
  // Updating User Information
  const { userId } = req;
  const { updates } = req.body;
  try {
    await updateUserById(userId, updates);
    sendResponse(res, { updates });
  } catch (e) {
    logger.error(`Error ${e}, ${e.stack}`);
    sendResponse(res, null, 404, false, "An error has occured");
  }
});
// Define other endpoints (PUT, DELETE, etc.) as needed

module.exports = {
  app,
};
