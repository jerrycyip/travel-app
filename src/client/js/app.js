import {validateTrip} from "./helper.js";
import {droplet2} from "../index.js";
import {snowflake} from "../index.js";
import {wind} from "../index.js";
import {sunshine} from "../index.js";

const serverURL = "http://localhost:8084/api";
let liveClocks = setInterval(setClocks, 1000);

// set live clocks for different trip destinations
function setClocks() {
    let clocks = document.querySelectorAll(".local-time");
    for(let clock of clocks){
        let tzone = Object.keys(clock.dataset).toString().replace(`_`, `/`);
        //console.log(tzone)
        clock.innerHTML = localDateTime(tzone);
    }
}

const syncScroll = (event) => {
    //event.preventDefault();

    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    div1.scrollLeft = div2.scrollLeft*(div1.offsetWidth/div2.offsetWidth);
}
// Abbreviate wind direction
function windDirShort(direction){
    let shortDir =  direction.replace(/est/g, "");
    shortDir = shortDir.replace(/ast/g, "");
    shortDir = shortDir.replace(/orth/g, "");
    shortDir = shortDir.replace(/outh/g, "");
    return shortDir.toUpperCase();
}

// convert km to miles
function kmToMi(amt){
    return Math.round(amt/1.609 * 10)/10;
}
// convert centimers to inches
function cmToIn(amt){
    return Math.round(amt/2.54 * 100)/100;
}
// calculate days until trip
function daysLeft(start){
    let today = new Date();
    let todayDt = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    todayDt = new Date(todayDt);

    let startDt = new Date(`${start} 00:00:00`);
    const oneDayMs = 24 * 60 * 60 * 1000; // millisec in a day
    daysLeft = Math.round((startDt - todayDt) / oneDayMs);
    return daysLeft
}

// calculate days until trip
function duration(start, end){
    let startDt = new Date(`${start} 00:00:00`);
    let endDt = new Date(`${end} 00:00:00`);
    const oneDayMs = 24 * 60 * 60 * 1000; // millisec in a day
    daysLeft = Math.round((endDt - startDt) / oneDayMs) + 1;
    return daysLeft
}

function dayOfWeek(date){
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let dt = new Date(`${date} 00:00:00`);
    return days[dt.getDay()];
}

function localWeekDay(tZone) {
    let currentTime = new Date();
    return currentTime.toLocaleDateString('en-US', { timeZone: tZone, weekday:'short'});
}

function localDate(tZone) {
    let currentTime = new Date();
    return currentTime.toLocaleDateString('en-US', { timeZone: tZone, year: '2-digit', month: 'numeric', day: 'numeric' });
}

function localDateTime(tZone) {
    let currentTime = new Date();
    let localTime = currentTime.toLocaleTimeString('en-US',{ timeZone: tZone, hour: 'numeric', minute: 'numeric', hour12: true, year: '2-digit', month: 'numeric', day: 'numeric', weekday:'short'});
    let timeIndex = localTime.lastIndexOf(',')+2;
    let dateIndex = localTime.indexOf(',')+2;
    //console.log(localTime.slice(timeIndex) + localTime.slice(dateIndex, timeIndex-2) + localTime.slice(0, dateIndex-2))
    return localTime.slice(timeIndex) + ", " + localTime.slice(dateIndex, timeIndex-2) + " (" + localTime.slice(0, dateIndex-2) +")";
  }

function cToF(temp){
    return Math.round((temp * 9/5))+32;
}

function toStandardTime(militaryTime) {
    let timeArray = militaryTime.split(':');
    if (timeArray[0].charAt(0) == 1 && timeArray[0].charAt(1) > 2) {
        return (timeArray[0] - 12) + ':' + timeArray[1] + ' PM';
    } 
    else {
        if (timeArray[0].charAt(0) == 0){
            return timeArray[0].slice(1) + ':' + timeArray[1] + ' AM';
        }
        else{
          return timeArray[0] + ':' + timeArray[1] + ' AM';
        }
    }
}  

function localTime(tZone) {
    let currentTime = new Date();
    //document.getElementById('txt').innerHTML =
/*    let timeHolder = document.createElement('span');
    timeHolder.classList.add("local-time");*/
    return currentTime.toLocaleTimeString('en-US',{ timeZone: tZone, hour: 'numeric', minute: 'numeric', hour12: true});
    //return currentTime.toLocaleString('en-US', { timeZone: tZone, hour: 'numeric', minute: 'numeric', hour12: true, year: '2-digit', month: 'numeric', day: 'numeric' });
    //var t = setTimeout(localTime(tZone), 500);
    //return t;
  }

 function dateString(date){
     let dt = new Date(`${date} 00:00:00`);
    return ((dt.getMonth() + 1)) + '/' + dt.getDate() + '/' + dt.getFullYear().toString().substr(-2);
 }

 function dateString2(date){
 let dt = new Date(`${date} 00:00:00`);
 console.log("dateString2:", 
 (dt.getFullYear()+'-'+ ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + (dt.getDate() + 1)).slice(-2)));
 return (dt.getFullYear()+'-'+ ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + (dt.getDate() + 1)).slice(-2));
}
  
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
        //update UI w/ the trip info results
        .then(function(res){
            toggleModal();
           // const tripImage = document.getElementById("trip-image");
            
            //console.log(`url("${res.image}")`);
          //  tripImage.style.backgroundImage = `url("${res.image}")`;
            

            let destination = "";
            if(res.country == "United States"){
                destination = `${res.city}, ${res.adminName1}`
            }
            else destination = `${res.city}, ${res.country}`;
            let countdown = daysLeft(start_dt);
            let countdownMsg = "";
            switch(countdown){
                case 0:
                countdownMsg = `Your trip starts today!`;
                break;
                case 1:
                countdownMsg =  `${countdown} day until your trip!`;
                break;
                default:
                countdownMsg = `${countdown} days until your trip`;
            }
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
                        <h3>${countdownMsg}</h3>
                        <div class="btn-group">
                            <button class="trip-btn">Save Trip</button>
                            <button class="trip-btn">Delete Trip</button>
                        </div>
                    </div>
                </div>  
            </div> 
            `;

            let dt = new Date(`${start_dt} 00:00:00`);
            let endDt = new Date(`${end_dt} 00:00:00`);
            let startDt = new Date(`${start_dt} 00:00:00`);

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
                        <img class="weather-icon" src="https://www.weatherbit.io/static/img/icons/${res.weather[dateStr2].icon}.png"
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
                    </div>`
                    dailyItineraries = dailyItineraries + dayItinerary;
                }
                    else {
                        let dayItinerary = `
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

            /*let tripHolder = document.createElement("div");
            tripHolder.className = "summary-wrapper";*/
            newTrip = newTrip + dailyDetail + dailyForecasts + itineraryHeader + dailyItineraries + closer;
            //console.log(newTrip);
            //tripHolder.innerHTML = newTrip;
            const modalContainer = document.querySelector(".modal-content");
            modalContainer.innerHTML = newTrip; 
        })

    }
    else {
        alert("please provide a valid destination and date range");
        console.log("please provide a valid destination and date range");
    }
}


function toggleModal(){
    let modal = document.getElementById("modal-test");
    modal.classList.toggle("display-off");
}
// Post fetch request to server with provided trip details
const postTrip = async (url='', data={}) => {
    console.log("postRequest executing to url:", url);
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
        const newTrip = await response.json();
        return newTrip;
    } catch (error) {
        console.log("error occured:", error);
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
    let dd = ("0" + new_end.getDate()).slice(-2);
    let mm = ("0" + (new_end.getMonth() + 1)).slice(-2) //January is 0! & force 2 digit MM
    let yyyy = new_end.getFullYear();
    new_end = yyyy+'-'+mm+'-'+dd;
    
    document.getElementById("end").setAttribute("value", new_end);
    }
 else return;   
}

export{liveClocks}
export{syncScroll}
//export {newEntry}
export {handleSubmit}
//export {stickyWeather}
