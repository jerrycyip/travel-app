// Setup empty JS object to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
// Require bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Note: Express provides these alternatives to above middleware:
//app.use(express.json());
//app.use(express.urlencoded());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Routing
// Post Route: add new weather journal entry
app.post('/add', addEntry);

function addEntry(req, res) {
    projectData.push(req.body);
    res.send(projectData[projectData.length - 1]);
}
// Get all weather journal entries
app.get('/all', getEntries);

function getEntries(req, res) {
    /*console.log(projectData);*/
    res.send(projectData);
}

// Define port #
const port = 3000;

// Setup Server
const server = app.listen(port, listening);
function listening() {
    console.log(`server running on local host: ${port}`);
}