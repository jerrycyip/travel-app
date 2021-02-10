// Setup empty JS object to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require('express');
// Start up an instance of express app
const app = express();


/* Middleware*/
// Configure express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
// for using url encoded values
app.use(bodyParser.urlencoded({ extended: true }));
// for processing json
app.use(bodyParser.json());

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
    // Trip object for storing data from api calls
    let trip = {
        city: "",
        adminCode1: "",
        adminName1: "",
        country: "",
        localTime: "",
        timeZone: "",
        start: "",
        end: "",
        //countdown: "",
        image: "",
        weather: {}
    }

    const locale = req.body.destination;
    let start = req.body.start;
    trip.start = start;
    let startDt = new Date(start);
    const end = req.body.end;
    trip.end = end;
    const endDt = new Date(end);
    let today = new Date();
    let todayDt = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    todayDt = new Date(todayDt);

    // calculate days until trip
    const oneDayMs = 24 * 60 * 60 * 1000; // millisec in a day
    daysLeft = Math.round((startDt - todayDt) / oneDayMs);

    if (daysLeft == 1) {
        console.log(`${daysLeft} day until your trip!`);
    }
    else {
        console.log(`${daysLeft} days until your trip!`);
    }
    // get lat/long and other geographical details of destination
    const geoCoords = await geoNamesAPI(locale);
    trip.city = geoCoords.name;
    trip.adminCode1 = geoCoords.adminCode1;
    trip.adminName1 = geoCoords.adminName1;
    trip.country = geoCoords.country;

    // get current local time at destination
    const geoTime = await geoTimeAPI(geoCoords.lat, geoCoords.lng);
    trip.localTime = geoTime.time;
    trip.timeZone = geoTime.timezoneId;


    // calculate UTC date time for last day of forecasted weather data
    let forecastEnd = new Date(`${geoTime.time}`);
    forecastEnd.setDate(forecastEnd.getDate() + 14);
    let forecastEndDt = forecastEnd.getFullYear() + '-' + ('0' + (forecastEnd.getMonth() + 1)).slice(-2) + '-' + ('0' + forecastEnd.getDate()).slice(-2);
    forecastEnd = new Date(forecastEndDt);

    // calculate UTC date time for first day of statistical weather data    
    let statStart = new Date(`${geoTime.time}`);
    statStart.setDate(statStart.getDate() + 15);
    let statStartDt = statStart.getFullYear() + '-' + ('0' + (statStart.getMonth() + 1)).slice(-2) + '-' + ('0' + statStart.getDate()).slice(-2);
    statStart = new Date(statStartDt);
    


    let destinationTime = new Date(`${geoTime.time}`);
    let destination = "";
    let destTime = destinationTime;
    destTime.setDate(destTime.getDate());
    let destDt = destTime.getFullYear() + '-' + ('0' + (destTime.getMonth() + 1)).slice(-2) + '-' + ('0' + destTime.getDate()).slice(-2);
    let destTimeDt = new Date(destDt);
    console.log("destDt:", destDt);
    console.log("destTimeDt:", destTimeDt);
    
    let obsEnd = new Date(destTimeDt);
    obsEnd.setDate(obsEnd.getDate());
    obsEnd = obsEnd.getFullYear() + '-' + ('0' + (obsEnd.getMonth() + 1)).slice(-2) + '-' + ('0' + obsEnd.getDate()).slice(-2);
    console.log("obsEnd:", obsEnd);

    // retrieve local time in destination
    if (geoCoords.country == 'United States') {
        console.log(`Current date, time in ${geoCoords.name}, ${geoCoords.adminCode1}:`, destinationTime.toLocaleDateString('en-US'), destinationTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
        destination = `${geoCoords.name} ${geoCoords.adminName1}`;
    }
    else {
        console.log(`Current date, time in ${geoCoords.name}, ${geoCoords.country}:`, destinationTime.toLocaleDateString('en-US'), destinationTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
        destination = `${geoCoords.name} ${geoCoords.country}`;
    }

    // call the Pixabay API to retrieve image of destination
    const localePix = await pixAPI(destination);
    //console.log(localePix);
    if(localePix == "no image"){
        //trip.image = "https://pixabay.com/get/gb317d34e5dce42645251c83f1b66255fd5c73fb562d5aa59f8fb6a7f740dc1edb70668c7c4a8e907e924bc09a0641134940ba85032972233f0b12cdfb4a155fc_1280.jpg";
        trip.image = "https://pixabay.com/get/gc129c9ff40123972163210fed7013af85d4e5fb994f13e06b049b5810b5661eb129893383edea06b39caf9cf8e83ba5528bfc7df8028de617abb343e2cbe492e_1280.jpg";
    }
    else{
        trip.image = localePix.webformatURL;
    }
    console.log("start:", start);
    console.log("startDt:", startDt);
    console.log("startDt.getDate()", startDt.getDate());
    console.log("startDt.getTime()", startDt.getTime());
    console.log("end:", end)
    console.log("endDt:", endDt);
    console.log("forecastEnd:", forecastEnd);
    console.log("statStartDt:", statStartDt);
    console.log("statStart:", statStart);
    console.log("startDt.getTime():", startDt.getTime());
    console.log("forecastEnd.getTime():", forecastEnd.getTime());
    console.log("endDt.getTime()", endDt.getTime());

    if(startDt.getTime() <= destTimeDt.getTime()){
        const obsWeather = await vcWeatherAPI(start, destDt/*obsEnd*/, geoCoords.lat, geoCoords.lng, "obs%2Ccurrent");
        try {
            for (day of obsWeather['days']) {
                trip.weather[day.datetime] = {}
                trip.weather[day.datetime]['high'] = day.tempmax;
                trip.weather[day.datetime]['low'] = day.tempmin;
                trip.weather[day.datetime]['temp'] = day.temp;
                trip.weather[day.datetime]['humidity'] = day.humidity;
                trip.weather[day.datetime]['sunrise'] = day.sunrise;
                trip.weather[day.datetime]['sunset'] = day.sunset;
                trip.weather[day.datetime]['icon'] = weatherIconCode(day.icon);
                trip.weather[day.datetime]['description'] = day.conditions.replace("with", `w/`);
                trip.weather[day.datetime]['precipProb'] = day.precipprob;
                trip.weather[day.datetime]['precip'] = day.precip
                trip.weather[day.datetime]['wind'] = day.windspeed;
                trip.weather[day.datetime]['windDir'] = day.winddir;
                trip.weather[day.datetime]['windDirFull'] = windDirection(day.winddir);
                trip.weather[day.datetime]['snow'] = day.snow;
                trip.weather[day.datetime]['moonPhase'] = day.moonphase;
                //trip.weather[day.datetime]['snowDepth'] = day.snowdepth;
                //trip.weather[day.datetime]['feelsLike'] = day.feelslike;
            }
            console.log("observed weather forecast:");
            console.log(trip);
            startDt = destTimeDt;
            start = destDt;
        }
        catch (error) {
            console.log("error occured", error);
        }

    }        


    if (startDt.getTime() > forecastEnd.getTime()) {
        const statWeather = await vcWeatherAPI(start, end, geoCoords.lat, geoCoords.lng, "stats");
        //console.log("stat weather \n:", statWeather);
        try {
            for (day of statWeather['days']) {
                trip.weather[day.datetime] = {}
                trip.weather[day.datetime]['high'] = day.tempmax;
                trip.weather[day.datetime]['low'] = day.tempmin;
                trip.weather[day.datetime]['temp'] = day.temp;
                trip.weather[day.datetime]['humidity'] = day.humidity;
                trip.weather[day.datetime]['sunrise'] = day.sunrise;
                trip.weather[day.datetime]['sunset'] = day.sunset;
                trip.weather[day.datetime]['icon'] = weatherIconCode(day.icon);
                trip.weather[day.datetime]['description'] = day.conditions.replace("with", `w/`);
                trip.weather[day.datetime]['precipProb'] = day.precipprob;
                trip.weather[day.datetime]['precip'] = day.precip
                trip.weather[day.datetime]['wind'] = day.windspeed;
                trip.weather[day.datetime]['windDir'] = day.winddir;
                trip.weather[day.datetime]['windDirFull'] = windDirection(day.winddir);
                trip.weather[day.datetime]['snow'] = day.snow;
                trip.weather[day.datetime]['moonPhase'] = day.moonphase;
                //trip.weather[day.datetime]['snowDepth'] = day.snowdepth;
                //trip.weather[day.datetime]['feelsLike'] = day.feelslike;
            }
            console.log("statistical future weather forecast:");
            console.log(trip);
        }
        catch (error) {
            console.log("error occured", error);
        }

    }
    else if (endDt.getTime() <= forecastEnd.getTime()) {
        
        const forecastWeather = await weatherAPI(start, end, geoCoords.lat, geoCoords.lng);
        //console.log("forecastWeather", forecastWeather);
        try {
            console.log("filtered results:");

            let dt = new Date(start);
            while (dt.getTime() <= endDt.getTime()) {
                console.log("dt.getTime():", dt.getTime(), "endDt.getTime():", endDt.getTime(), "startDt.getTime:", startDt.getTime());
                if(dt.getTime() >= startDt.getTime() && dt.getTime() <= endDt.getTime()){
                let dateFormatted = dt.getUTCFullYear() + '-' + ('0' + (dt.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + dt.getUTCDate()).slice(-2);
                console.log("formatted date:", dateFormatted)
                if (dateFormatted in forecastWeather){
                //console.log(forecastWeather[`${dateFormatted}`]);
                trip.weather[dateFormatted] = {}
                trip.weather[dateFormatted]['high'] = forecastWeather[dateFormatted].max_temp;
                trip.weather[dateFormatted]['low'] = forecastWeather[dateFormatted].min_temp;
                trip.weather[dateFormatted]['temp'] = forecastWeather[dateFormatted].temp;
                trip.weather[dateFormatted]['humidity'] = forecastWeather[dateFormatted].rh;
                trip.weather[dateFormatted]['sunrise'] = localTime(forecastWeather[dateFormatted].sunrise_ts, trip.timeZone);
                trip.weather[dateFormatted]['sunset'] = localTime(forecastWeather[dateFormatted].sunset_ts, trip.timeZone);
                trip.weather[dateFormatted]['icon'] = forecastWeather[dateFormatted].weather.icon;
                trip.weather[dateFormatted]['description'] = forecastWeather[dateFormatted].weather.description.replace("with", `w/`);
                trip.weather[dateFormatted]['precipProb'] = forecastWeather[dateFormatted].pop;
                trip.weather[dateFormatted]['precip'] = forecastWeather[dateFormatted].precip;
                trip.weather[dateFormatted]['wind'] = forecastWeather[dateFormatted].wind_spd * 3.6;
                trip.weather[dateFormatted]['windDir'] = forecastWeather[dateFormatted].wind_dir;
                trip.weather[dateFormatted]['windDirFull'] = forecastWeather[dateFormatted].wind_cdir_full;
                trip.weather[dateFormatted]['snow'] = forecastWeather[dateFormatted].snow;
                trip.weather[dateFormatted]['moonPhase'] = forecastWeather[dateFormatted].moon_phase_lunation;
            }
                dt.setDate(dt.getDate() + 1);
                console.log("next date counter:", dt);
            }
        }
            console.log(trip);
        }
        catch (error) {
            console.log("error occured", error);
        }
        
    }
    else {
        const forecastWeather = await weatherAPI(start, end, geoCoords.lat, geoCoords.lng);
        //console.log("unfiltered forecast results:", forecastWeather);
        try {
            console.log("filtered results:");

            let dt = new Date(start);
            while (dt.getTime() <= forecastEnd.getTime()) {

                if(dt.getTime() >= startDt.getTime() && dt.getTime() <= endDt.getTime()){
                let dateFormatted = dt.getUTCFullYear() + '-' + ('0' + (dt.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + dt.getUTCDate()).slice(-2);
                console.log("formatted date:", dateFormatted)
                //console.log(forecastWeather[`${dateFormatted}`]);
                trip.weather[dateFormatted] = {}
                trip.weather[dateFormatted]['high'] = forecastWeather[dateFormatted].max_temp;
                trip.weather[dateFormatted]['low'] = forecastWeather[dateFormatted].min_temp;
                trip.weather[dateFormatted]['temp'] = forecastWeather[dateFormatted].temp;
                trip.weather[dateFormatted]['humidity'] = forecastWeather[dateFormatted].rh;
                trip.weather[dateFormatted]['sunrise'] = localTime(forecastWeather[dateFormatted].sunrise_ts, trip.timeZone);
                trip.weather[dateFormatted]['sunset'] = localTime(forecastWeather[dateFormatted].sunset_ts, trip.timeZone);
                trip.weather[dateFormatted]['icon'] = forecastWeather[dateFormatted].weather.icon;
                trip.weather[dateFormatted]['description'] = forecastWeather[dateFormatted].weather.description.replace("with", `w/`);
                trip.weather[dateFormatted]['precipProb'] = forecastWeather[dateFormatted].pop;
                trip.weather[dateFormatted]['precip'] = forecastWeather[dateFormatted].precip;
                trip.weather[dateFormatted]['wind'] = forecastWeather[dateFormatted].wind_spd * 3.6;
                trip.weather[dateFormatted]['windDir'] = forecastWeather[dateFormatted].wind_dir;
                trip.weather[dateFormatted]['windDirFull'] = forecastWeather[dateFormatted].wind_cdir_full;
                trip.weather[dateFormatted]['snow'] = forecastWeather[dateFormatted].snow;
                trip.weather[dateFormatted]['moonPhase'] = forecastWeather[dateFormatted].moon_phase_lunation;
                dt.setDate(dt.getDate() + 1);
                console.log("next date counter:", dt);
                }
            }
        }
        catch (error) {
            console.log("error occured", error);
        }
        const statWeather = await vcWeatherAPI(statStartDt, end, geoCoords.lat, geoCoords.lng, "stats");
        //console.log(statWeather);
        try {
            for (day of statWeather['days']) {
                trip.weather[day.datetime] = {}
                trip.weather[day.datetime]['high'] = day.tempmax;
                trip.weather[day.datetime]['low'] = day.tempmin;
                trip.weather[day.datetime]['temp'] = day.temp;
                trip.weather[day.datetime]['humidity'] = day.humidity;
                trip.weather[day.datetime]['sunrise'] = day.sunrise;
                trip.weather[day.datetime]['sunset'] = day.sunset;
                trip.weather[day.datetime]['icon'] = weatherIconCode(day.icon);
                trip.weather[day.datetime]['description'] = day.conditions;
                trip.weather[day.datetime]['precipProb'] = day.precipprob;
                trip.weather[day.datetime]['precip'] = day.precip
                trip.weather[day.datetime]['wind'] = day.windspeed;
                trip.weather[day.datetime]['windDir'] = day.winddir;
                trip.weather[day.datetime]['windDirFull'] = windDirection(day.winddir);
                trip.weather[day.datetime]['snow'] = day.snow;
                trip.weather[day.datetime]['moonPhase'] = day.moonphase;
                //trip.weather[day.datetime]['snowDepth'] = day.snowdepth;
                //trip.weather[day.datetime]['feelsLike'] = day.feelslike;
            }
            console.log("statistical future weather forecast:");
            console.log(trip);
        }
        catch (error) {
            console.log("error occured", error);
        }

}

    //  const weatherHistData = await weatherHistory(start, end, geoCoords.lat, geoCoords.lng);
    res.send(trip);
    console.log("sent trip info");
    console.log('finished');
}

// function to map wind direction in degrees to wind direction description. reference: https://www.campbellsci.com/blog/convert-wind-directions
function windDirection(degrees) {
    const compassSections = ["north","north-northeast","northeast","east-northeast","east","east-southeast","southeast","south-southeast",
                            "south","south-southwest","southwest","west-southwest","west","west-northwest","northwest","north-northwest","north"];
    const compassIndex = Math.round(degrees / 22.5);
    return compassSections[compassIndex];
}
// function to map visual crossing icon description to weatherbit icon image
function weatherIconCode(description){
    switch(description){
        case "snow":
            return "s02d";
            break;
        case "rain":
            return "r02d";
            break;
        case "fog":
            return "a05d";
            break;
        case "overcast":
            return "w00d";
            break;        
        case "wind":
            return "c04d"; //"z00d" if able to use own images
            break;
        case "cloudy":
            return "c04d";
            break;
        case "partly-cloudy-day":
            return "c02d";
            break;
        case "partly-cloudy-night":
            return "c02n";
            break;
        case "clear-day":
            return "c01d";
            break;
        case "clear-night":
            return "c01n";
            break;
    }
}

function localTime(epochTime, timeZone) {
    let dt = new Date(epochTime * 1000);
    //let localTime = dt.toLocaleTimeString("en", {timeZone:tz});
    let localTime = dt.toLocaleString('en-US', {timeZone:timeZone, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
    //console.log(localTime);
    return localTime;
//    var newTime = d.toLocaleTimeString("en", {timeZone:"Asia/Singapore"});
}

async function pixAPI(destination) {
    const pixUrl = "https://pixabay.com/api/";
    const locale = encodeURI(destination)
    const allCats = 'travel,places,buildings,nature'
    const maxResults = 3;
    console.log("request made to:", pixUrl + `?key=${pixKey}` + `&q=${locale}` + `&category=${allCats}` + "&order=popular" + `&per_page=${maxResults}`);

    const responseTravel = await fetch(pixUrl + `?key=${pixKey}` + `&q=${locale}` + `&category=travel` + "&order=popular" + `&per_page=${maxResults}`);
    const responseAllCats = await fetch(pixUrl + `?key=${pixKey}` + `&q=${locale}` + `&category=${allCats}` + "&order=popular" + `&per_page=${maxResults}`);

    try {
        const resultsTravel = await responseTravel.json();
        const resultsAllCats = await responseAllCats.json()
        let results = "";
        console.log("resultsAllCats:", resultsAllCats);
        console.log("resultsAllCats.total:", resultsAllCats.total);

        if(resultsAllCats.total == 0){
            results = "no image";
            return results;
        }
        else if (resultsTravel.total == 0) {
            results = resultsAllCats;
        }
        else {
            results = resultsTravel;
        }
        //console.log("filtered top result:", results['hits'][0]);
        return results['hits'][0];
    }
    catch (error) {
        console.log("error occured", error);
    }
}

async function obsWeatherAPI(start, end, lat, lng) {
    const weatherStatUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    console.log("request made to:", weatherStatUrl + `${lat}` + "%2C" + `${lng}` + "/" + `${start}` + "/" + `${end}` + "?" + "unitGroup=metric" + "&" + `key=${weatherVcKey}` + "&" + "include=obs,current");
    const response = await fetch(weatherStatUrl + `${lat}` + "%2C" + `${lng}` + "/" + `${start}` + "/" + `${end}` + "?" + "unitGroup=metric" + "&" + `key=${weatherVcKey}` + "&" + "include=obs,current");
    //console.log("raw response:", response);
    const weatherForecast = {};

    try {
        const results = await response.json();
        weatherForecast['resolvedAddress'] = results.resolvedAddress;
        weatherForecast['remainingCosts'] = results.remainingCost;
        weatherForecast['remainingCredits'] = results.remainingCredits;
        weatherForecast['days'] = results['days'];
        //results['days'].forEach(element => weatherForecast[element['datetime']] = element);
        //console.log("raw stat weather:", weatherForecast);
        //        console.log(results['data'][0]['weather']);
        return weatherForecast;
    }
    catch (error) {
        console.log("error occured", error);
    }
}

// retrieve weather data from visual crossing for dates > 14 days (statistical forecast data) and/or dates in the past (historical/current observations)
async function vcWeatherAPI(start, end, lat, lng, type) {
    const weatherStatUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    console.log("request made to:", weatherStatUrl + `${lat}` + "%2C" + `${lng}` + "/" + `${start}` + "/" + `${end}` + "?" + "unitGroup=metric" + "&" + `key=${weatherVcKey}` + "&" + `include=${type}`);
    const response = await fetch(weatherStatUrl + `${lat}` + "%2C" + `${lng}` + "/" + `${start}` + "/" + `${end}` + "?" + "unitGroup=metric" + "&" + `key=${weatherVcKey}` + "&" + `include=${type}`);
    //console.log("raw response:", response);
    const weatherForecast = {};

    try {
        const results = await response.json();
        weatherForecast['resolvedAddress'] = results.resolvedAddress;
        weatherForecast['remainingCosts'] = results.remainingCost;
        weatherForecast['remainingCredits'] = results.remainingCredits;
        weatherForecast['days'] = results['days'];
        //results['days'].forEach(element => weatherForecast[element['datetime']] = element);
        //console.log("raw stat weather:", weatherForecast);
        //        console.log(results['data'][0]['weather']);
        return weatherForecast;
    }
    catch (error) {
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
        //console.log("raw weather forecast:", results);
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
    catch (error) {
        console.log("error occured", error);
    }
}


// function to retrieve the current time at travel destination from GeoNames API
async function geoTimeAPI(lat, lng) {
    const geoTimeUrl = " http://api.geonames.org/timezoneJSON?";

    //const locale = req.body.destination;
    const maxResults = 3;

    console.log("request made to:", geoTimeUrl + `lat=${lat}` + "&" + `lng=${lng}` + "&" + `username=${geoKey}`);
    const response = await fetch(geoTimeUrl + `lat=${lat}` + "&" + `lng=${lng}` + "&" + `username=${geoKey}`);

    try {
        const results = await response.json();
        //console.log(results);
        //console.log("date-time:", results.time);

        return results;
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

    console.log("request made to:", geoNamesUrl + locale + "&" + `maxResults=${maxResults}` + "&" + `username=${geoKey}`);
    const response = await fetch(geoNamesUrl + locale + "&" + `maxRows=${maxResults}` + "&" + `username=${geoKey}`);

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