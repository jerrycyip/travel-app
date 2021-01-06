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
// pixabay api key for retrieving images
const pixKey = process.env.pixabay_key;

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

    const geoCoords = await geoNamesAPI(locale);
    // get current local time at destination
    const geoTime = await geoTimeAPI(geoCoords.lat, geoCoords.lng);

    // calculate UTC date time for last day of forecasted weather data
    let forecastEnd = new Date(`${geoTime}`);
    forecastEnd.setDate(forecastEnd.getDate()+15);
    let forecastEndDt = forecastEnd.getFullYear() + '-' + ('0'+(forecastEnd.getMonth()+1)).slice(-2) + '-' + ('0'+forecastEnd.getDate()).slice(-2);
    forecastEnd = new Date(forecastEndDt);

// calculate UTC date time for first day of statistical weather data    
    let statStart = new Date(`${geoTime}`);
    statStart.setDate(statStart.getDate()+16);
    let statStartDt = statStart.getFullYear() + '-' + ('0'+(statStart.getMonth()+1)).slice(-2) + '-' + ('0'+statStart.getDate()).slice(-2);
    statStart= new Date(statStartDt);

    let destinationTime = new Date(`${geoTime}`);
    let destination = "";

    if(geoCoords.country == 'United States')
    {
        console.log(`Current date, time in ${geoCoords.name}, ${geoCoords.adminCode1}:`, destinationTime.toLocaleDateString('en-US'), destinationTime.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12:true}));
        destination = `${geoCoords.name} ${geoCoords.adminName1}`;
    }
    else {
        console.log(`Current date, time in ${geoCoords.name}, ${geoCoords.country}:`, destinationTime.toLocaleDateString('en-US'), destinationTime.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12:true}));
        destination = `${geoCoords.name} ${geoCoords.country}`;
    }

    // call the Pixabay API to retrieve image of destination
        const localePix = await pixAPI(destination);
        console.log(localePix);

    console.log("start:", start);
    console.log("startDt:", startDt);
    console.log("end:", end)
    console.log("endDt:", endDt);
    console.log("forecastEnd:", forecastEnd);
    console.log("statStartDt:", statStartDt);
    console.log("statStart:", statStart);
    console.log("startDt.getTime():",startDt.getTime());
    console.log("forecastEnd.getTime():",forecastEnd.getTime());
    console.log("endDt.getTime()", endDt.getTime());

   if(startDt > forecastEnd){
       const statWeather = await statWeatherAPI(start, end, geoCoords.lat, geoCoords.lng);
    }
    else if(endDt <= forecastEnd) {
        const forecastWeather = await weatherAPI(start, end, geoCoords.lat, geoCoords.lng);
        try {
        console.log("filtered results:");

        let dt = new Date(start);
        while(dt <= endDt){     
            let dateFormatted = dt.getUTCFullYear() + '-' + ('0' + (dt.getUTCMonth()+1)).slice(-2) + '-' + ('0' + dt.getUTCDate()).slice(-2);
            console.log("formatted date:", dateFormatted)
            console.log(forecastWeather[`${dateFormatted}`]);
            dt.setDate(dt.getDate()+1);
            console.log("next date counter:", dt);
        }
    }
        catch(error){
            console.log("error occured", error);
        }
    }
    else {
        const forecastWeather = await weatherAPI(start, end, geoCoords.lat, geoCoords.lng);
        try {
            console.log("filtered results:");

            let dt = new Date(start);
            while(dt <= forecastEnd/*endDt*/){     
                //if(endDt.getTime()<=forecastEnd.getTime()){

                let dateFormatted = dt.getUTCFullYear() + '-' + ('0' + (dt.getUTCMonth()+1)).slice(-2) + '-' + ('0' + dt.getUTCDate()).slice(-2);
                console.log("formatted date:", dateFormatted)
                console.log(forecastWeather[`${dateFormatted}`]);
                dt.setDate(dt.getDate()+1);
                console.log("next date counter:", dt);
            }        
    }
    catch(error){
        console.log("error occured", error);
    }
    const statWeather = await statWeatherAPI(statStartDt, end, geoCoords.lat, geoCoords.lng);
}    

  //  const weatherHistData = await weatherHistory(start, end, geoCoords.lat, geoCoords.lng);
    console.log('finished');
}

async function pixAPI(destination){
    const pixUrl = "https://pixabay.com/api/";
    const locale = encodeURI(destination)
    const cats = 'places,travel,buildings,nature'
    const maxResults = 3;
    console.log("request made to:", pixUrl+`?key=${pixKey}`+`&q=${locale}`+`&category=${cats}`+"&order=popular"+`&per_page=${maxResults}`);
    const response = await fetch(pixUrl+`?key=${pixKey}`+`&q=${locale}`+`&category=${cats}`+"&order=popular"+`&per_page=${maxResults}`);

    try{
        const results = await response.json();
        //console.log("filtered top result:", results['hits'][0]);
        return results['hits'][0];
    }
    catch (error){
        console.log("error occured", error);
    }
}

async function statWeatherAPI(start, end, lat, lng){
    const weatherStatUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    console.log("request made to:", weatherStatUrl + `${lat}` + "%2C" +`${lng}` + "/" + `${start}`+ "/" +`${end}` + "?" + "unitGroup=metric" + "&" + `key=${weatherVcKey}`+"&"+"include=stats");
    const response = await fetch(weatherStatUrl + `${lat}` + "%2C" +`${lng}` + "/" + `${start}`+ "/" +`${end}` + "?" + "unitGroup=metric" + "&" + `key=${weatherVcKey}`+"&"+"include=stats");
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
        //console.log(weatherForecast);
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
// function to retrieve the current time at travel destination from GeoNames API
async function geoTimeAPI(lat, lng){
    const geoTimeUrl = " http://api.geonames.org/timezoneJSON?";

    //const locale = req.body.destination;
    const maxResults = 3;

    console.log("request made to:", geoTimeUrl + `lat=${lat}`+"&"+`lng=${lng}`+"&"+`username=${geoKey}`);
    const response = await fetch(geoTimeUrl + `lat=${lat}`+"&"+`lng=${lng}`+"&"+`username=${geoKey}`);

    try {
        const results = await response.json();
        console.log(results);
        console.log("date-time:", results.time);
        
        return results.time;
    }
    catch (error) {
        console.log("error occured:", error);
    }
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
            adminCode1: firstRow['adminCode1'],
            adminName1: firstRow['adminName1'],
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