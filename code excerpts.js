/* from server.js */
async function geoTimeAPI(lat, lng){
    const geoTimeUrl = " http://api.geonames.org/timezoneJSON?";

    //const locale = req.body.destination;
    const maxResults = 3;

    console.log("request made to:", geoTimeUrl + `lat=${lat}`+"&"+`lng=${lng}`+"&"+`username=${geoKey}`);
    const response = await fetch(geoTimeUrl + `lat=${lat}`+"&"+`lng=${lng}`+"&"+`username=${geoKey}`);

    try {
        const results = await response.json();
        console.log(results);
        
        return results;
    }
    catch (error) {
        console.log("error occured:", error);
    }
}

function localTime(epochTime, tz) {
    var d = new Date(epochTime * 1000);
    //var d = new Date(1609887959 * 1000);
    var newTime = d.toLocaleTimeString("en", {timeZone:tz});
    console.log(newTime);
//    var newTime = d.toLocaleTimeString("en", {timeZone:"Asia/Singapore"});
}

function syncScroll (div) {
    var div1 = document.getElementById("div1");
    div1.scrollLeft = div.scrollLeft;
}

        padding-bottom: 1px;



        onscroll="return Client.syncScroll(event)"


// from client app.js:

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
        const newData = await res.json();
        return newData;
    }
    catch (error) {
        console.log("error occurred:", error);
    }
}


<img class="trip-photo" src="../media/maldives.jpg" alt="Trip Photo">

<h4 class="cat-fill">
                            [ Categories <!--<span class="test">&#9658 </span>-->]
                            <!-- <span class="material-icons md-18">
                                format_color_fill
                                
                                    format_paint
                                    palette 
                                    label 
                                    category 
                                    format_paint 
                                    brush
                                
                                </span>-->
                        </h4>
                        <!--
                        <h4 class="food-cat">
                            Food&nbsp
                            <span class="material-icons md-18 ">
                            restaurant local_bar
                            </span>
                        </h4>
                        <h4 class="activity-cat">
                            Activity&nbsp
                            <span class="material-icons md-18">
                                directions_run snowboarding
                                </span>
                        </h4>
                        <h4 class="logistics-cat">
                            Logistics&nbsp
                            <span class="material-icons md-18 ">
                                flight hotel
                                </span>
                        </h4>
                        <h4 class="shopping-cat">
                            Shopping&nbsp;
                            <span class="material-icons md-18 ">
                                shopping_bag store
                                </span>
                        </h4>
                        <h4 class="entertainment-cat">
                            Entertainmt.&nbsp
                            <span class="material-icons md-18 ">
                                local_activity theaters
                                </span>                            
                        </h4>
                        <h4 class="other-cat">Other</h4>
                    -->

                    <!-- <div class="itinerary-more">
                        <button class="expander">[ + ]</button>
                    </div> -->                     

                    //let dropletPath = 'media/droplet-2.png';
                /*let testURL = 'https://www.weatherbit.io/static/img/icons/${res.weather[dateStr2].icon}.png';
                let weatherData = res.weather;
                console.log("nested object:", weatherData);
                let dayWeatherData = weatherData["2021-02-04"];
                console.log("nested nested object:", dayWeatherData);
                console.log("nested nested object2:", weatherData[dateStr2]);
                console.log("nested nested object3:", res.weather[dateStr2]);
                console.log("nested nested object4:", res.weather[dateStr2].icon);
                console.log("nested nested object5:", `${res.weather[dateStr2].icon}`);
//                console.log("src url:", `https://www.weatherbit.io/static/img/icons/${res.weather.dateStr2.icon}.png`);
*/                    

Countdown:&nbsp<span class="countdown"></span>

<section class="modal display-off" onload="liveClocks()" id="modal-test">
            <div class="trip-container">
                <div class="modal-content">
                    <!--
                <div class="summary-wrapper">
                <div class="trip-summary">
                    <div class="trip-image">
                     <img class = "trip-photo" src="../media/maldives.jpg"alt="trip image">
                </div>
                <div class="modal-details">
                    <h2 class="locale">Cancun, Mexico</h2>
                    <h3 class="dates">Depart:&nbsp<span id="depart-date">10/1/21 (Thu)</span></h3>
                    <h3 class="dates">Return:&nbsp<span id="return-date">10/8/21 (Thu)</span></h3>
                    <h3>Local Time:&nbsp<span id="local-time">7:53 AM, 7/28 (Wed)</span></h3>
                    <h3><span class="countdown">100 days until your trip</h3>
                    <div class="btn-group">
                        <button class="trip-btn">Save Trip</button>
                        <button class="trip-btn">Delete Trip</button>
                    </div>
                </div>
            </div>
        </div>
                    <div class="trip-daily-detail">
                        <div class="trip-daily-container">
                            <div class="trip-daily-wrapper">
                                <div class="forecast-container" id="sticky-weather">
                                    <div class="forecast-header">
                                        <h3>Weather Forecast &nbsp</h3> -->
                                        <!-- <span>&nbsp&nbsp[+]</span> -->
<!--                                        <div class="weather-details"> <!-- </div> -->
                                            <!-- <button class="expander">[ Details ] -->
                                                <!-- <span class="expander-arrow">&#9660</span> -->
<!--                                            </button>
                                        </div>
                                    </div>
                                    <div class="daily-forecasts" id="div1">
                                        <div class="day-forecast">
                                            <div class="day-border">
                                                <h4 class="forecast-date">Thu 10/1</h4>
                                                <img class="weather-icon" src="../media/weather_icons/a01d.png"
                                                    alt="few clouds">
                                                <div class="weather-desc">Few Clouds</div>
                                                <div class="high-low">81&#176<span class="temp-divider"> |
                                                    </span>69&#176&nbsp
                                                    <img class="precip-icon" src="../media/droplet2.png"
                                                        alt="precipitation probability">
                                                    <span class="precip-prob">1%</span>
                                                </div>
                                                <div class="sunrise">Sunrise: 7:01AM</div>
                                                <div class="sunset">Sunset: 6:09 PM</div>
                                            </div>
                                        </div>
                                        <div class="day-forecast">
                                            <div class="day-border">
                                                <h4 class="forecast-date">Fri 10/2</h4>
                                                <img class="weather-icon" src="../media/weather_icons/a01d.png"
                                                    alt="few clouds">
                                                <div class="weather-desc">Few Clouds</div>
                                                <div class="high-low">81&#176<span class="temp-divider"> |
                                                    </span>69&#176&nbsp
                                                    <img class="precip-icon" src="../media/droplet2.png"
                                                        alt="precipitation probability">
                                                    <span class="precip-prob">1%</span>
                                                </div>
                                                <div class="sunrise">Sunrise: 7:01AM</div>
                                                <div class="sunset">Sunset: 6:09 PM</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="itinerary-header">
                                        <h3>Itinerary</h3>
                                        <h4 class="cat-fill">
                                            [ Categories ]
                                        </h4>
                                    </div>
                                </div>
                                <div class="itinerary-schedule">
                                    <div class="itinerary-timeline">7 AM <span class="sched-expand">&#9650</span></div>
                                    <div class="itinerary-timeline">8 AM</div>
                                    <div class="itinerary-timeline">9 AM</div>
                                    <div class="itinerary-timeline">10 AM</div>
                                    <div class="itinerary-timeline">11 AM</div>
                                    <div class="itinerary-timeline">12 PM</div>
                                    <div class="itinerary-timeline">1 PM</div>
                                    <div class="itinerary-timeline">2 PM</div>
                                    <div class="itinerary-timeline">3 PM</div>
                                    <div class="itinerary-timeline">4 PM</div>
                                    <div class="itinerary-timeline">5 PM</div>
                                    <div class="itinerary-timeline">6 PM</div>
                                    <div class="itinerary-timeline">7 PM</div>
                                    <div class="itinerary-timeline">8 PM</div>
                                    <div class="itinerary-timeline">9 PM</div>
                                    <div class="itinerary-timeline">10 PM</div>
                                    <div class="itinerary-timeline">11 PM &#9660</div>
                                </div>
                                <div class="itinerary-container">
                                    <div class="itinerary-wrapper" id="div2">
                                        <div class="itinerary-input">
                                            <div class="textareaElement food" contenteditable>Pack breakfast for flight
                                                (example)</div>
                                            <div class="textareaElement logistics" contenteditable>7:30am Uber to ____
                                                airport (example)</div>
                                            <div class="textareaElement logistics" contenteditable>9:15am 2 hr flight to
                                                _____ (example)</div>
                                            <div class="textareaElement logistics" contenteditable></div>
                                            <div class="textareaElement logistics" contenteditable>Pick up rental @___ +
                                                drive to downtown (example)</div>
                                            <div class="textareaElement food" contenteditable>12pm Lunch resos @____
                                                (example) </div>
                                            <div class="textareaElement activity" contenteditable>Explore downtown and
                                                views @______ (example)</div>
                                            <div class="textareaElement activity" contenteditable></div>
                                            <div class="textareaElement logistics" contenteditable>Check-in to hotel
                                                @_____ (example)</div>
                                            <div class="textareaElement activity" contenteditable>2 hr hike around_____
                                                (example)</div>
                                            <div class="textareaElement activity" contenteditable></div>
                                            <div class="textareaElement food" contenteditable>6:30 Dinner resos @_____
                                                (example)</div>
                                            <div class="textareaElement food" contenteditable></div>
                                            <div class="textareaElement entertainment" contenteditable>8pm Tix to Show
                                                @_____ (example)</div>
                                            <div class="textareaElement entertainment" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                        </div>
                                        <div class="itinerary-input">
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                            <div class="textareaElement" contenteditable></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>-->
                    </div>
                </div>
        </section>

        <div class="all-trips">
            <div class="title">
                <h3>My Trips</h3>
            </div>
            <div class="view-trips">
                <div class="view-entry">
                    <!--<div class="title">
                    <h3 id="view-title">Paradise</h3>
                </div> -->
                    <!--
                    <div id="entryHolder">
                        <div class="meta-details">
                            <h4>
                                <div id="destination2"></div>
                                <div id="weather"></div>
                                <div id="weather-info">
                                    <div id="temp-details">
                                        <div id="temp"></div>
                                    </div>
                                    <div class="weather-icon"></div>
                                </div>
                                <div id="date"></div>
                            </h4>
                        </div>
                        <div class="mood-holder">
                            <div id="content"></div>
                        </div>
                    </div>
-->
                </div>
            </div>
        </div>



const syncScroll = (event) => {
    //event.preventDefault();

    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    div1.scrollLeft = div2.scrollLeft * (div1.offsetWidth / div2.offsetWidth);
}

/*
        .then(function(res){
            toggleModal();
            let destination = "";
            if(res.country == "United States"){
                destination = `${res.city}, ${res.adminName1}`
            }
            else destination = `${res.city}, ${res.country}`;
            
            let countdownMsg = ctDown(start_dt, res.timeZone);
            console.log("countdownMsg2:", countdownMsg);
            let startDt = new Date(`${start_dt}T00:00:00`.replace(/\s/, 'T'));

            let tripDuration = duration(start_dt, end_dt);
            let durationMsg = "";
            switch(tripDuration){
                case 1:
                    durationMsg = `1 Day`;
                    break;
                default:
                    durationMsg = `${tripDuration} Days`;
            }
            let newTrip = `
            <div class="summary-wrapper">
            <div class="trip-summary">
            <div class="trip-image">
            <img class = "trip-photo" src="${res.image}" alt="trip image">
            </div>
                    <div class="modal-details">
                        <h2 class="locale">${destination}</h2>
                        <h3 class="dates">Depart:&nbsp<span class="depart-date">${dateString(start_dt)} (${dayOfWeek(start_dt)})</span></h3>
                        <h3 class="dates">Return:&nbsp<span class="return-date">${dateString(end_dt)} (${dayOfWeek(end_dt)})</span></h3>
                        <h3 class="dates">Duration:&nbsp<span class="duration">${durationMsg}</span></h3>
                        <h3>Local Time:&nbsp<span class="local-time" data-${res.timeZone.replace(`/`, "_")}>${localDateTime(res.timeZone)}</span></h3>
                        <h3 class="countdown" data-${res.timeZone.replace(`/`, "_")} data-${start_dt}>${countdownMsg}</h3>
                        <div class="btn-group">
                            <button class="trip-btn update-btn" id=updateTrip-${res.id}>Update Trip</button>
                            <button class="trip-btn" id=saveTrip-${res.id}>Save Trip</button>
                            <button class="trip-btn" id=deleteTrip-${res.id}>Delete Trip</button>
                        </div>
                    </div>
                </div>  
            </div> 
            `;

            let dt = new Date(`${start_dt}T00:00:00`.replace(/\s/, 'T'));
            let endDt = new Date(`${end_dt}T00:00:00`.replace(/\s/, 'T'));

            let dailyDetail = `
            <div class="trip-daily-detail">
                <div class="trip-daily-container">
                    <div class="trip-daily-wrapper">
                        <div class="forecast-container" id="sticky-weather">
                            <div class="forecast-header">
                                <h3>Weather Forecast &nbsp</h3>
                                <div class="weather-details">
                                <button class="expander">[ Details ]</button>
                            </div>
                        </div>
                            <div class="daily-forecasts" id="div1">
                        `;
            let itineraryHeader = `
                </div>
                <div class="itinerary-header">
                    <h3>Itinerary Planner</h3>
                    <h4 class="cat-fill">
                        [ Categories ]
                    </h4>
                </div>
            </div>
            <div class="itinerary-schedule">
                <div class="itinerary-timeline">7 AM <span class="sched-expand">&#9650</span></div>
                <div class="itinerary-timeline">8 AM</div>
                <div class="itinerary-timeline">9 AM</div>
                <div class="itinerary-timeline">10 AM</div>
                <div class="itinerary-timeline">11 AM</div>
                <div class="itinerary-timeline">12 PM</div>
                <div class="itinerary-timeline">1 PM</div>
                <div class="itinerary-timeline">2 PM</div>
                <div class="itinerary-timeline">3 PM</div>
                <div class="itinerary-timeline">4 PM</div>
                <div class="itinerary-timeline">5 PM</div>
                <div class="itinerary-timeline">6 PM</div>
                <div class="itinerary-timeline">7 PM</div>
                <div class="itinerary-timeline">8 PM</div>
                <div class="itinerary-timeline">9 PM</div>
                <div class="itinerary-timeline">10 PM</div>
                <div class="itinerary-timeline">11 PM &#9660</div>
            </div>
            `;
            let dailyForecasts = ``;
            let dailyItineraries = ``;

            while (dt.getTime() <= endDt.getTime()) {
                //console.log("date counter:", dt);
                let dateStr = (dt.getMonth() + 1) + '/' + dt.getDate();
                //console.log("dateStr counter:", dateStr);
                let dateStr2 = (dt.getFullYear()+'-'+ ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2));
                //console.log("dateStr2 counter:", dateStr2);
                let precipIcon = droplet2;
                if (res.weather[dateStr2].description.toLowerCase().includes('snow')){
                    precipIcon = snowflake;
                    
                }
                let dayForecast = `
                <div class="day-forecast">
                    <div class="day-border">
                        <h4 class="forecast-date">${dayOfWeek(dateStr2)} ${dateStr}</h4>
                        <img class="weather-icon" src="/imgs/${res.weather[dateStr2].icon}.png"
                            alt="few clouds">
                        <div class="weather-desc">${res.weather[dateStr2].description}</div>
                        <div class="high-low">${cToF(res.weather[dateStr2].high)}&#176
                        <span class="divider"> |</span>
                        ${cToF(res.weather[dateStr2].low)}&#176
                            </div>
                            <div class ="precip">
                            <img class="precip-icon" src="${precipIcon}" alt="precipitation probability">
                            <span class="precip-prob">${Math.round(res.weather[dateStr2].precipProb)}%</span>
                            <span class="precip-amt">&nbsp${cmToIn(res.weather[dateStr2].precip)}"</span>
                            </div>
                            <div>                            
                            <img class="wind-icon" src="${wind}" alt="wind icon">
                            <span class="wind-spd">${kmToMi(res.weather[dateStr2].wind)} mph ${windDirShort(res.weather[dateStr2].windDirFull)}</span>
                            </div>
                        <div class="sunrise">
                        <img class="sun-icon" src="${sunshine}" alt="sunrise sunset icon">
                        <span class="sunTime">${toStandardTime(res.weather[dateStr2].sunrise)}</span>
                        <span class="divider"> &#8208</span>
                        <span class="sunTime">${toStandardTime(res.weather[dateStr2].sunset)}</span>
                        </div>
                    </div>
                </div>
                `;
                dailyForecasts = dailyForecasts + dayForecast;
                if (dt.getTime() == startDt.getTime()){
                let dayItinerary = `
                <div class="itinerary-container">
                <div class="itinerary-wrapper" id="itinerary-${res.id}">
                    <div class="itinerary-input ${dt}-itinerary">
                        <div class="textareaElement food" contenteditable>Pack breakfast for flight
                            (example)</div>
                        <div class="textareaElement logistics" contenteditable>7:30am Uber to ____
                            airport (example)</div>
                        <div class="textareaElement logistics" contenteditable>9:15am 2 hr flight to
                            _____ (example)</div>
                        <div class="textareaElement logistics" contenteditable></div>
                        <div class="textareaElement logistics" contenteditable>Pick up rental @___ +
                            drive to downtown (example)</div>
                        <div class="textareaElement food" contenteditable>12pm Lunch resos @____
                            (example) </div>
                        <div class="textareaElement activity" contenteditable>Explore downtown and
                            views @______ (example)</div>
                        <div class="textareaElement activity" contenteditable></div>
                        <div class="textareaElement logistics" contenteditable>Check-in to hotel
                            @_____ (example)</div>
                        <div class="textareaElement activity" contenteditable>2 hr hike around_____
                            (example)</div>
                        <div class="textareaElement activity" contenteditable></div>
                        <div class="textareaElement food" contenteditable>6:30 Dinner resos @_____
                            (example)</div>
                        <div class="textareaElement food" contenteditable></div>
                        <div class="textareaElement entertainment" contenteditable>8pm Tix to Show
                            @_____ (example)</div>
                        <div class="textareaElement entertainment" contenteditable></div>
                        <div class="textareaElement" contenteditable></div>
                        <div class="textareaElement" contenteditable></div>
                    </div>`
                    dailyItineraries = dailyItineraries + dayItinerary;
                }
                    else {
                        let dayItinerary = `
                    <div class="itinerary-input ${dt}-itinerary">
                    <div class="textareaElement 7am" contenteditable></div>
                    <div class="textareaElement 8am" contenteditable></div>
                    <div class="textareaElement 9am" contenteditable></div>
                    <div class="textareaElement 10am" contenteditable></div>
                    <div class="textareaElement 11am" contenteditable></div>
                    <div class="textareaElement 12pm" contenteditable></div>
                    <div class="textareaElement 1pm" contenteditable></div>
                    <div class="textareaElement 2pm" contenteditable></div>
                    <div class="textareaElement 3pm" contenteditable></div>
                    <div class="textareaElement 4pm" contenteditable></div>
                    <div class="textareaElement 5pm" contenteditable></div>
                    <div class="textareaElement 6pm" contenteditable></div>
                    <div class="textareaElement 7pm" contenteditable></div>
                    <div class="textareaElement 8pm" contenteditable></div>
                    <div class="textareaElement 9pm" contenteditable></div>
                    <div class="textareaElement 10pm" contenteditable></div>
                    <div class="textareaElement 11pm" contenteditable></div>
                </div>
                `;
                dailyItineraries = dailyItineraries + dayItinerary;
            }

                dt.setDate(dt.getDate() + 1);
            }
            let closer = `
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
            `;


            newTrip = newTrip + dailyDetail + dailyForecasts + itineraryHeader + dailyItineraries + closer;
            //console.log(newTrip);
            //tripHolder.innerHTML = newTrip;
            const modalContainer = document.querySelector(".trip-content");
            modalContainer.id = res.id;
            modalContainer.innerHTML = newTrip; 
//            let tripDetails = res;
        handleResult(newTrip, tripDetails, "modal");
        })
*/

<span class="sched-expand">&#9650</span>
<span class="sched-expand">&#8249</span>

<div class="itinerary-timeline">11 PM &#9660</div>

/**
 * @description load the trip entry into the modal
 * @param {*} entry - Element to be loaded
 * @param {*} id - Trip id
 */
const loadEntry = (entry) => {
    const modalContainer = document.querySelector(".trip-content");
    modalContainer.innerHTML = entry;

    // Handle buttons on the trip container
    save.style.display = "inline-block";
    updateBtn.style.display = "none";

};

// calculate days until trip
function daysLeft(start) {
    console.log("daysLeft called with:", start);
    let today = new Date();
    let todayDt = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    todayDt = new Date(todayDt);
   /* to address Safari invalid date issue: \s metacharacter regex is used to find whitespace character to be replaced with 'T'
    https://stackoverflow.com/questions/4310953/invalid-date-in-safari
    */
    let startDt = new Date(`${start}T00:00:00`.replace(/\s/, 'T'));
    const oneDayMs = 24 * 60 * 60 * 1000; // millisec in a day
    let daysRemaining = Math.round((startDt - todayDt) / oneDayMs);
    return daysRemaining;
}
//not used because ctDown function fails when calling it
function ctDown(start, tzone) {
    //let countdown = daysLeft(start); /* for some reason this call fails*/</div>
}

daysLeft = Math.round((startDt - todayDt) / oneDayMs);

if (daysLeft == 1) {
    console.log(`${daysLeft} day until your trip!`);
}
else {
    console.log(`${daysLeft} days until your trip!`);
}

let obsEnd = new Date(destTimeDt);
    obsEnd.setDate(obsEnd.getDate());
    obsEnd = obsEnd.getFullYear() + '-' + ('0' + (obsEnd.getMonth() + 1)).slice(-2) + '-' + ('0' + obsEnd.getDate()).slice(-2);
    //console.log("obsEnd:", obsEnd);

    function addEntry(req, res) {
    tripData.push(req.body);
    res.send(tripData[tripData.length - 1]);
}    

// Get all weather journal entries
app.get('/all', getEntries);
function getEntries(req, res) {
    /*console.log(tripData);*/
    res.send(tripData);
}

from package.json
"devDependencies": {
    "@babel/core": "^7.12.3",
    "@babel/preset-env": "^7.12.1",
    "babel-loader": "^8.2.1",
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^5.1.1",
    "fetch-node": "^0.0.1",
    "file-loader": "^6.2.0",
    "html-loader": "^1.3.2",
    "html-webpack-plugin": "^4.5.2",
    "i": "^0.3.6",
    "mini-css-extract-plugin": "^0.12.0", 
    //"^1.3.9",
    "node-sass": "^5.0.0",
    "npm": "^6.14.11",
    "optimize-css-assets-webpack-plugin": "^5.0.4",
    "sass-loader": "^10.1.1",
    "style-loader": "^2.0.0",
    "supertest": "^6.1.3",
    "terser-webpack-plugin": "^4.2.3", 
    //"^5.0.3",
    "webpack-dev-server": "^3.11.2",
    "workbox-webpack-plugin": "^6.1.1"
  }