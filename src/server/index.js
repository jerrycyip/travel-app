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
const geoKey = process.env.geo_key;
const weatherBitKey = process.env.weatherbit_key;
// visual crossing api key for dates beyond 16 days (use historical proxy)
const weatherVcKey = process.env.weathervc_key;

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
   // const geoTime = await geoTimeAPI(geoCoords.lat, geoCoords.lng);
    const weatherData = await weatherAPI(start, end, geoCoords.lat, geoCoords.lng);
    console.log('finished');
  //  const weatherHistData = await weatherHistory(start, end, geoCoords.lat, geoCoords.lng);
}

// function to retrieve weather data for given coords and dates
async function weatherHistory(start, end, lat, lng) {
    //const weatherHistUrl = "https://api.weatherbit.io/v2.0/history/hourly?";
    const weatherHistUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"

    let start_dt = new Date(start);
    let end_dt = new Date(end)
    let lastyr_start = start_dt.setFullYear( start_dt.getFullYear() - 1 );
    lastyr_start = new Date(lastyr_start);
    let lastyr_end = end_dt.setFullYear( end_dt.getFullYear() - 1 );
    lastyr_end = new Date(lastyr_end);

    let start_dd = lastyr_start.getDate();
    let start_mm = lastyr_start.getMonth()+1; //January is 0!
    let start_yyyy = lastyr_start.getFullYear();

    if(start_dd<10){
            start_dd='0'+ start_dd
        } 
    if(start_mm<10){
        start_mm='0'+ start_mm
    } 
    lastyr_start = start_yyyy+'-'+start_mm+'-'+start_dd+':13';

    let end_dd = lastyr_end.getDate();
    let end_mm = lastyr_end.getMonth()+1; //January is 0!
    let end_yyyy = lastyr_end.getFullYear();

    if(end_dd<10){
            end_dd='0'+end_dd
        } 
    if(end_mm<10){
        end_mm='0'+end_mm
    } 
    lastyr_end = end_yyyy+'-'+end_mm+'-'+end_dd+':14';

    console.log("request made to:", weatherHistUrl + "&" + `lat=${lat}` + "&" +`start_date=${lastyr_start}`+ "&" +`end_date=${lastyr_end}` + "&" + `lon=${lng}` + "&" + `key=${weatherBitKey}`);
    const response = await fetch(weatherHistUrl + "&" + `lat=${lat}` + "&" +`start_date=${lastyr_start}`+ "&" +`end_date=${lastyr_end}` + "&" + `lon=${lng}` + "&" + `key=${weatherBitKey}`);

    try {
        const results = await response.json();
        console.log(results);
        console.log(results['data'])
//        console.log(results['data'][0]['weather']);
        return results;
    }
    catch (error){
        console.log("error occured", error);
    }
}
// function to retrieve weather data for given coords and dates
async function weatherAPI(start, end, lat, lng) {
    const weatherBitUrl = "https://api.weatherbit.io/v2.0/forecast/daily?";

    console.log("request made to:", weatherBitUrl + "&" + `lat=${lat}` + "&" + `lon=${lng}` + "&" + `key=${weatherBitKey}`);
    const response = await fetch(weatherBitUrl + "&" + `lat=${lat}` + "&" + `lon=${lng}` + "&" + `key=${weatherBitKey}`);
    try {
        const results = await response.json();
        console.log(results);
        console.log("timezone:", results['timezone']);
        console.log(results['data'][0]['weather']);
        


        return results;
    }
    catch (error){
        console.log("error occured", error);
    }
}

function localTime(epochTime, tz) {
    var d = new Date(epochTime * 1000);
    //var d = new Date(1609887959 * 1000);
    var newTime = d.toLocaleTimeString("en", {timeZone:tz});
    console.log(newTime);
//    var newTime = d.toLocaleTimeString("en", {timeZone:"Asia/Singapore"});

}
/*
async function geoTimeAPI(lat, lng){
    const geoTimeUrl = " http://api.geonames.org/timezoneJSON?";

    //const locale = req.body.destination;
    const maxResults = 3;

    console.log("request made to:", geoTimeUrl + `lat=${lat}`+"&"+`lng=${lng}`+"&"+`username=${geoKey}`);
    const response = await fetch(geoTimeUrl + `lat=${lat}`+"&"+`lng=${lng}`+"&"+`username=${geoKey}`);

    try {
        const results = await response.json();
        console.log(results);
        //firstRow = results['geonames'][0];
        //console.log(firstRow);
        
        return firstRow;
    }
    catch (error) {
        console.log("error occured:", error);
    }
}
*/
// function to retrieve lat/long from GeoNames API using destination as input
async function geoNamesAPI(locale) {
    const geoNamesUrl = "http://api.geonames.org/searchJSON?q=";
   
    //const locale = req.body.destination;
    const maxResults = 3;

    console.log("request made to:", geoNamesUrl + locale +"&"+ `maxResults=${maxResults}` +"&"+ `username=${geoKey}`);
    const response = await fetch(geoNamesUrl + locale +"&"+`maxRows=${maxResults}` +"&"+ `username=${geoKey}`);

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