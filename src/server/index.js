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
    const startDt = new Date(start);
    const end = req.body.end;
    const endDt = new Date(end);



    const today = new Date();
    const forecastEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate()+15);
    console.log("start:", start);
    console.log("startDt:", startDt);
    console.log("end:", end)
    console.log("endDt:", endDt);
    console.log("forecastEnd:", forecastEnd);

    const geoCoords = await geoNamesAPI(locale);
   
   if(startDt > forecastEnd){
       const statWeather = await statWeatherAPI(start, end, geoCoords.lat, geoCoords.lng);
    }
    else if(endDt<forecastEnd){
        const forecastWeather = await weatherAPI(start, end, geoCoords.lat, geoCoords.lng);
        try {
        console.log("filtered results:");

        let dt = new Date(start);
        while(dt <= endDt){     
            let dateFormatted = dt.getUTCFullYear() + '-' + (dt.getUTCMonth()+1) + '-' + dt.getUTCDate();  
            //dateFormatted.toString
            console.log("formatted date:", dateFormatted)
            console.log(forecastWeather[`${dateFormatted}`]);
            nextDt = new Date(dt);
            dt.setDate(dt.getDate()+1);
//            dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1);
            console.log("date counter:", dt);
           //date = new Date(newDate);
        }
        
    }

        
        /*forecastWeather.forEach(element => {
            
        })*/
    
    catch(error){
        console.log("error occured", error);
    }
}
    else {
    const forecastWeather = await weatherAPI(start, end, geoCoords.lat, geoCoords.lng);
    const statWeather = await statWeatherAPI(start, end, geoCoords.lat, geoCoords.lng);

}    
  //  const weatherHistData = await weatherHistory(start, end, geoCoords.lat, geoCoords.lng);
    console.log('finished');
}

async function statWeatherAPI(start, end, lat, lng){
    const weatherStatUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    console.log("request made to:", weatherStatUrl + `${lat}` + "%2C" +`${lng}` + "/" + `${start}`+ "/" +`${end}` + "?" + "unitGroup=us" + "&" + `key=${weatherVcKey}`+"&"+"include=stats");
    const response = await fetch(weatherStatUrl + `${lat}` + "%2C" +`${lng}` + "/" + `${start}`+ "/" +`${end}` + "?" + "unitGroup=us" + "&" + `key=${weatherVcKey}`+"&"+"include=stats");
    //console.log("raw response:", response);

    try {
        const results = await response.json();
        console.log("future forecast:")
        console.log(results);
        //console.log(results['data'])
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
    //const weatherForecast = [];
    const weatherForecast = {};

    console.log("request made to:", weatherBitUrl + "&" + `lat=${lat}` + "&" + `lon=${lng}` + "&" + `key=${weatherBitKey}`);
    const response = await fetch(weatherBitUrl + "&" + `lat=${lat}` + "&" + `lon=${lng}` + "&" + `key=${weatherBitKey}`);
    try {
        const results = await response.json();
        //console.log(results);
/*        console.log("city:", results['city_name']);
        console.log("country:", results['country_code']);
        console.log("timezone:", results['timezone']);*/
        //results['data'].forEach(element => console.log(element));
        //results['data'].forEach(element => console.log(element, element['weather']))
        weatherForecast['city'] = results['city_name'];
        weatherForecast['country'] = results['country_code'];
        weatherForecast['timezone'] = results['timezone'];
        results['data'].forEach(element => weatherForecast[element['datetime']] = element)
        console.log(weatherForecast);
        //console.log("timezone:", results['timezone']);
//        console.log(results['data'][0]['weather']);
        return weatherForecast;
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