const express = require("express");
const bodyParser = require("body-parser");
var { logRequestDetails } = require("./middleware");
const { processReminder } = require("./functions");

const app = express();
app.use(bodyParser.json());
app.use(logRequestDetails);

app.post("/", async (req, res) => {
  // Logic to create a new contact in Firestore or another database
  const { reminderId } = req.body;
  console.log(`Processing ${reminderId}`);
  try {
    var newReminderObject = await processReminder(reminderId);
  } catch (e) {
    console.log(`Error ${e}, ${e.stack}`);
  }
  res.json({ reminder: newReminderObject });
});

// Define other endpoints (PUT, DELETE, etc.) as needed

module.exports = {
  app,
};
