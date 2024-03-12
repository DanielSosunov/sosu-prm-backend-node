const express = require('express');
const bodyParser = require('body-parser');
var { logRequestDetails } = require('./middleware')

const app = express();
app.use(bodyParser.json());
app.use(logRequestDetails)

app.post('/', (req, res) => {
    // Logic to create a new contact in Firestore or another database
    const { name, email } = req.body;
    res.json({ message: `Creating new contact: ${name}, ${email}` });
});

// Define other endpoints (PUT, DELETE, etc.) as needed

module.exports = {
    app
}