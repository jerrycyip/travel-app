// Setup empty JS object to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require('express');
// Start up an instance of express app
const app = express();


/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
// Require bodyParser
const bodyParser = require('body-parser');
// for using url encoded values
app.use(bodyParser.urlencoded({ extended: true }));
// for processing json
app.use(bodyParser.json());
//Note: Express provides these alternatives to above middleware:
//app.use(express.json());
//app.use(express.urlencoded());

/* Other Dependencies */
// access and interact with the file system
const path = require('path')

/* Secure api keys as environment variables */
const dotenv = require('dotenv');
dotenv.config();
// store api keys:
const geo_key = process.env.geo_key;
const weather_key = process.env.weather_key;

// CORs for allowing cross origin requests
const cors = require('cors');
app.use(cors());
// Require node-fetch for making 3rd party API calls
const fetch = require('node-fetch');

/* Static Routing */
// routing of site to directory of bundled assets
app.use(express.static('dist'))
// routing for loading site
app.get('/', function (req, res) {
    res.sendFile(path.resolve('src/client/views/index.html'))
})

/* API calls */
// POST method to recieve initial trip details from user's client browser
app.post('/api', callApis);

// main function for retrieving data from 3rd party APIs
async function callApis(req, res) {
    const locale = req.body.destination;
    const start = req.body.start;
    const end = req.body.end;

    const geoCoords = await geoNamesAPI(locale);
    
    const weatherData = await weatherAPI(start, end, geoCoords.lat, geoCoords.lng);
    console.log('finished');
}

// function to retrieve weather data for given coords and dates
async function weatherAPI(start, end, lat, lng) {
    const weatherBitUrl = "https://api.weatherbit.io/v2.0/forecast/daily?";

    console.log("request made to:", weatherBitUrl + "&" + `lat=${lat}` + "&" + `lon=${lng}` + "&" + `key=${weather_key}`);
    const response = await fetch(weatherBitUrl + "&" + `lat=${lat}` + "&" + `lon=${lng}` + "&" + `key=${weather_key}`);
    try {
        const results = await response.json();
        console.log(results);
        console.log(results['data'][0]['weather']);
        return results;
    }
    catch (error){
        console.log("error occured", error);
    }
}
// function to retrieve lat/long from GeoNames API using destination as input
async function geoNamesAPI(locale) {
    const geoNamesUrl = "http://api.geonames.org/searchJSON?q=";
    //const locale = req.body.destination;
    const maxResults = 3;

    console.log("request made to:", geoNamesUrl + locale +"&"+ `maxResults=${maxResults}` +"&"+ `username=${geo_key}`);
    const response = await fetch(geoNamesUrl + locale +"&"+`maxRows=${maxResults}` +"&"+ `username=${geo_key}`);
    try {
        const results = await response.json();
        //console.log(results);
        firstRow = results['geonames'][0];
        const geoCoords = {
            name: firstRow['name'],
            country: firstRow['countryName'],
            lat: firstRow['lat'],
            lng: firstRow['lng'],
        }
        console.log(firstRow);
        console.log(geoCoords);
        return geoCoords;
    }
    catch (error) {
        console.log("error occured:", error);
    }
}



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
const port = 8084;

// Setup Server
const server = app.listen(port, listening);
function listening() {
    console.log(`server running on local host: ${port}`);
}