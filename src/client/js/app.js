import {validateTrip} from "./helper.js";

const serverURL = "http://localhost:8084/api";

// main function for new trip submission
const handleSubmit = async(event) => {
    event.preventDefault();

    const locale = document.getElementById('destination').value;
    const start_dt = document.forms['trip-form']['start'].value;
    const end_dt = document.forms['trip-form']['end'].value;

    if(validateTrip(locale, start_dt, end_dt)){
        console.log("trip submission passed initial validation");
        // api GET call to geonames api with destination name
        postTrip(serverURL,{destination: locale, start: start_dt, end: end_dt})
    }
    else {
        alert("please provide a valid destination and date range");
        console.log("please provide a valid destination and date range");
    }

}

// Post fetch request to server with provided trip details
const postTrip = async (url='', data={}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error occured:", error);
    }
} 


// event listener that triggers new weather journal entry
//document.getElementById('generate').addEventListener('click', newEntry);

// add entry to weather journal
function newEntry(event) {
    // select the input values
    const zipCode = document.getElementById('zip').value;

    const currentMood = document.getElementById('feelings').value;
    // api GET call to openweathermap api with zip code
    getWeather(baseURL, zipCode, apiKey, units)
        // if API call is successful, POST weather data to server
        .then(function (weatherData) {
            postEntry('/add', {
                date: newDate, weather: weatherData.weather[0]['description'],
                icon: weatherData.weather[0]['icon'], temp: weatherData.main.temp,
                locale: weatherData.name, mood: currentMood
            });
        })
        .catch(error => {
            alert("Missing or invalid zip code!  Please try again");
            console.log("error occurred:", error);
        })
        .then(function (newEntry) {
            updateUI('/all');
        })
}

// retrieve weather data based on US zip code
const getWeather = async (baseURL, zip, apiKey, units) => {
    // GET fetch request to openweathermap.org API
    const res = await fetch(baseURL + zip + units + '&appid=' + apiKey)
    // if successful, log and return weather data
    try {
        const weatherData = await res.json();
        return weatherData;
    }
    catch (error) {
        console.log("error occurred:", error);
    }
}
// Post entry to server
const postEntry = async (url = '', data = {}) => {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            date: data.date,
            weather: data.weather,
            icon: data.icon,
            temp: data.temp,
            locale: data.locale,
            mood: data.mood
        })
    })
    try {
        const newEntry = await res.json();
        return newEntry;
    }
    catch (error) {
        console.log("error occurred:", error);
    }
}

// populate latest entry with weather and feelings
const updateUI = async (url = '') => {
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        }
    })
    try {
        allEntries = await res.json();
        // if successful clear input fields//
        document.getElementById('feelings').value = '';
        document.getElementById('zip').value = '';
        // then populate view latest entry section
        latestEntry = allEntries[allEntries.length - 1];
        weatherIcon = latestEntry.icon;
        document.getElementById('locale').innerHTML = latestEntry.locale;
        document.getElementById('temp').innerHTML = Math.round(latestEntry.temp) + "&#8457;";
        document.getElementById('weather').innerHTML = latestEntry.weather;
        document.querySelector('.weather-icon').innerHTML = `<img id="icon" src="${iconURL}${weatherIcon}${iconFormat}" alt="weather-icon"> </img>`;
        document.getElementById('date').innerHTML = days[d.getDay()] + " " + latestEntry.date;
        document.getElementById('content').innerHTML = latestEntry.mood;
        /*console.log(allEntries);*/
    }
    catch (error) {
        console.log("error occurred:", error);
    }
}

// Set minimum dates for trip
function setMinDates() {
    let today = new Date();
    let tm = new Date(today);
    tm.setDate(tm.getDate()+1);
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    let dd2 = tm.getDate();
    let mm2 = tm.getMonth()+1;
    let yyyy2 = tm.getFullYear();

    if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
    if(dd2<10){
            dd2='0'+dd2
        } 
        if(mm2<10){
            mm2='0'+mm2
        }         
    today = yyyy+'-'+mm+'-'+dd;
    tm = yyyy2+'-'+mm2+'-'+dd2;
    
    document.getElementById('start').setAttribute("min", today);
    document.getElementById('start').setAttribute("value", today);
    
    document.getElementById('end').setAttribute("min", today);
    document.getElementById('end').setAttribute("value", tm);
    
}
//setMinDates();
document.addEventListener("onload", setMinDates());

document.getElementById('start').addEventListener('change', setEndMin);

function setEndMin() {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    document.getElementById("end").setAttribute("min", start);
    
 if (end < start){
    let new_end = new Date(start);
    new_end.setDate(new_end.getDate()+2);
    let dd = new_end.getDate();
    let mm = new_end.getMonth()+1; //January is 0!
    let yyyy = new_end.getFullYear();
    new_end = yyyy+'-'+mm+'-'+dd;
    
    document.getElementById("end").setAttribute("value", new_end);
    }
 else return;   
}

export {newEntry}
export {handleSubmit}
