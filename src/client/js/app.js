import { droplet2 } from "../index.js";
import { snowflake } from "../index.js";
import { wind } from "../index.js";
import { sunshine } from "../index.js";
import { weatherIcons } from "../index.js";
import {validateTrip, setClocks, setMinDates, setEndMin, windDirShort, kmToMi, 
    cmToIn, duration, dayOfWeek, localDateTime, cToF, toStandardTime, dateString, 
    ctDown} from "./helper.js";

/** 
 * Set Global variables 
*/
const serverURL = "http://localhost:8084";
let newTrip = {};
let tripList = document.getElementById(".view-trips");

// Check for existing trips in local storage
let tripsArray = localStorage.getItem("trips")
    ? JSON.parse(localStorage.getItem("trips"))
    : [];
const tripsData = JSON.parse(localStorage.getItem("trips"));

// trigger live local clocks and live countdowns for each trip destination
let liveClocks = setInterval(setClocks, 30000);

// trigger new trip form initial minimum start and end date
document.addEventListener("onload", setMinDates());

// user input start date triggers trip form minimum end date
document.getElementById('start').addEventListener('change', setEndMin);

// trigger for loading saved trips once window loads
window.onload = () => loadTrips();
// alternatively: document.addEventListener("onload", loadTrips());

/**
*@description - main function for submitting new trip input form to retrieve 3rd party api data
 */
const handleSubmit = async (event) => {
    event.preventDefault();

    const locale = document.getElementById('destination').value;
    const start_dt = document.forms['trip-form']['start'].value;
    const end_dt = document.forms['trip-form']['end'].value;

    // validate trip dates are valid
    if (validateTrip(locale, start_dt, end_dt)) {
        // api call to express server with trip input details
        let res = await postTrip(`${serverURL}/api`, { destination: locale, start: start_dt, end: end_dt })
        //update UI with the returned 3rd party weather forecast data and destination image
        try{
            (displayTrip(res, "modal"));
        }
        catch{
            console.log("Error:", error);
        }
    }
    else {
        alert("please provide a valid destination and date range");
        console.log("please provide a valid destination and date range");
    }

}

/**
 * @description - display trip entry in either modal or saved trip list
 * @param {*} tripData - trip info to be displayed
 * @param {*} type - identify where trip is to be displayed on the UI (modal or saved trip list)
 */
export const displayTrip = (tripData, type) => {

    const start_dt = tripData.start;
    const end_dt = tripData.end;
    // define countdown message
    let countdownMsg = ctDown(start_dt, tripData.timeZone);
    // define duration message 
    let durationMsg = "";
    let tripDuration = duration(start_dt, end_dt);
    switch (tripDuration) {
        case 1:
            durationMsg = `1 Day`;
            break;
        default:
            durationMsg = `${tripDuration} Days`;
    }
    // define destination depending on country
    let destination = "";
    if (tripData.country == "United States") {
        destination = `${tripData.city}, ${tripData.adminName1}`
    }
    else destination = `${tripData.city}, ${tripData.country}`;

    // define default trip image if no image is found by Pixabay
    if(tripData.image == "none"){
        tripData.image = "/imgs/camera-travel.jpg"; 
    }
    // define startDt and endDt as used by o/ functions for display purposes
    /* to address Safari invalid date issue: \s metacharacter regex is used to replace whitespace characters with 'T'
    https://stackoverflow.com/questions/4310953/invalid-date-in-safari */

    let startDt = new Date(`${start_dt}T00:00:00`.replace(/\s/, 'T'));
    let endDt = new Date(`${end_dt}T00:00:00`.replace(/\s/, 'T'));

    // populate html template for displaying trip info
    let newTrip = `
        <div class="trip-content">
            <div class="summary-wrapper">
            <div class="trip-summary">
            <div class="trip-image">
            <img class = "trip-photo" src="${tripData.image}" alt="trip image">
            </div>
                    <div class="modal-details" style="background-image: url('${tripData.image}')">
                        <h2 class="locale">${destination}</h2>
                        <h3 class="dates">Depart:&nbsp<span class="depart-date">${dateString(start_dt)} (${dayOfWeek(start_dt)})</span></h3>
                        <h3 class="dates">Return:&nbsp<span class="return-date">${dateString(end_dt)} (${dayOfWeek(end_dt)})</span></h3>
                        <h3 class="dates">Duration:&nbsp<span class="duration">${durationMsg}</span></h3>
                        <h3>Local Time:&nbsp<span class="local-time" data-${tripData.timeZone.replace(`/`, "_")}>${localDateTime(tripData.timeZone)}</span></h3>
                        <h3 class="countdown" data-${tripData.timeZone.replace(`/`, "_")} data-${start_dt}>${countdownMsg}</h3>
                    </div>
                </div>  
            </div> 
        `;
    let dailyDetail = `
        <div class="trip-daily-detail">
            <div class="trip-daily-container">
                <div class="trip-daily-wrapper">
                    <div class="forecast-container" id="sticky-weather">
                        <div class="forecast-header">
                            <div class = "planner-title">
                            <h3>Trip Planner</h3>
                            <div class="weather-details">
                            <button class="expander">[ Forecast ]</button>
                            </div>
                            </div>
                        <div class="btn-group">
                        <button class="trip-btn update-btn" id=updateTrip-${tripData.id}>View Trip</button>
                        <button class="trip-btn save-btn" id=saveTrip-${tripData.id}>Save Trip</button>
                        <button class="trip-btn" id=deleteTrip-${tripData.id}>Delete Trip</button>
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
            <span class="material-icons expand-itin">
            &nbsp;keyboard_arrow_up
            </span>
            <div class="itinerary-timeline itin-up">7 AM</div>
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
            <div class="itinerary-timeline itin-down">11 PM</div>
            <span class="material-icons expand-itin">
            &nbsp;keyboard_arrow_down
            </span>
        </div>
        `;
    
    // instantiate html containers for forecast and itinerary data    
    let dailyForecasts = ``;
    let dailyItineraries = ``;

    // define dt counter for loop logic for weather forecast and itinerary days
    let dt = new Date(`${start_dt}T00:00:00`.replace(/\s/, 'T'));    
    while (dt.getTime() <= endDt.getTime()) {
        let dateStr = (dt.getMonth() + 1) + '/' + dt.getDate();
        let dateStr2 = (dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2));
        let snowing = tripData.weather[dateStr2].description.toLowerCase().includes('snow');
        let precipIcon = snowing ? snowflake : droplet2;
    // html template for weather forecast and itinerary data
        let dayForecast = `
            <div class="day-forecast">
                <div class="day-border">
                    <h4 class="forecast-date">${dayOfWeek(dateStr2)} ${dateStr}</h4>
                    <div class="icon-div">
                    <img class="weather-icon" src="/imgs/${tripData.weather[dateStr2].icon}.png"
                        alt="few clouds">
                        </div>
                    <div class="weather-desc">${tripData.weather[dateStr2].description}</div>
                    <div class="high-low">${cToF(tripData.weather[dateStr2].high)}&#176
                    <span class="divider"> |</span>
                    ${cToF(tripData.weather[dateStr2].low)}&#176
                        </div>
                        <div class ="precip">
                        <img class="precip-icon" src="${precipIcon}" alt="precipitation probability">
                        <span class="precip-prob">${Math.round(tripData.weather[dateStr2].precipProb)}%</span>
                        <span class="precip-amt">&nbsp${cmToIn(tripData.weather[dateStr2].precip)}"</span>
                        </div>
                        <div>                            
                        <img class="wind-icon" src="${wind}" alt="wind icon">
                        <span class="wind-spd">${kmToMi(tripData.weather[dateStr2].wind)} mph ${windDirShort(tripData.weather[dateStr2].windDirFull)}</span>
                        </div>
                    <div class="sunrise">
                    <img class="sun-icon" src="${sunshine}" alt="sunrise sunset icon">
                    <span class="sunTime">${toStandardTime(tripData.weather[dateStr2].sunrise)}</span>
                    <span class="divider"> &#8208</span>
                    <span class="sunTime">${toStandardTime(tripData.weather[dateStr2].sunset)}</span>
                    </div>
                </div>
            </div>
            `;
        dailyForecasts = dailyForecasts + dayForecast;
        if (dt.getTime() == startDt.getTime()) {
            let dayItinerary = `
            <div class="itinerary-container" >
            <div class="itinerary-wrapper" id="itinerary-${tripData.id}">
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
    let closer = "";
    
    // if displaying a previously saved trip, overwrite empty itinerary template with existing itinerary info
    
    if(type == "savedTrips" || type == "updateTrip") {
        let itineraryContainer = document.createElement("div");
        itineraryContainer.classList.add("itinerary-container");
        itineraryContainer.innerHTML = tripData.itineraries;

        closer = `      </div>    
                    </div>
                </div>
            </div>
        </div>
        `;

        dailyItineraries = itineraryContainer.outerHTML;
    }
            else{
                closer = `
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            }
    // combine different elements to create final html template
    newTrip = newTrip + dailyDetail + dailyForecasts + itineraryHeader + dailyItineraries + closer;
    let tripContainer = document.createElement("div");
    tripContainer.classList.add("trip-container");
    tripContainer.innerHTML = newTrip;
    // display either in the modal or saved trip list based on input 'type' parameter
    if (type =="modal" || type == "updateTrip" ) {
        toggleModal();
        let modalContainer = document.querySelector(".modal");
        modalContainer.append(tripContainer);
        // call function for handling button behavior on modal
        handleResult(tripContainer, tripData, "modal");
    }
    else{
        let savedTrip = document.createElement("div");
        savedTrip.classList.add("saved-trip");
        savedTrip.append(tripContainer);

        let savedTrips = document.getElementById("view-trips");
        savedTrips.prepend(savedTrip);
        // style UI for saved trips versus modal display
        document.querySelectorAll(".trip-container").forEach(el =>{
            el.style.overflowY = "hidden";
            el.style.overflowX = "hidden";
        });
        document.querySelectorAll(".daily-forecasts").forEach(el =>{
            el.style.paddingLeft = "0em";
        });
        document.querySelectorAll(".forecast-header").forEach(el =>{
            el.style.width = "74vw";
            el.style.maxWidth = "74vw";
        });
        document.querySelectorAll(".btn-group").forEach(el =>{
            el.style.marginLeft = 0;
        });
        document.querySelectorAll(".modal-details").forEach(el=>{
            el.style.borderLeft = "none";
        });
        
        let elems = [".itinerary-header",".itinerary-schedule",".itinerary-container"];
        for (let el of elems){
            hideElement(el);
        }        
        // call function for handling button behavior on saved trip list
        handleResult(savedTrip, tripData, "savedTrips");
    }
}

/**
 * @description - Handle button behavior for new and existing trips 
 * @param {*} entry - html trip container
 * @param {*} tripData - trip information for local storage and other processesing logic
 * @param {*} ui - - identify where said trip is displayed on the UI (modal or saved trip list)
 * */ 
export const handleResult = async (entry, tripData, ui) => {
    let saveBtn = document.getElementById(`saveTrip-${tripData.id}`);
    let updateBtn = document.getElementById(`updateTrip-${tripData.id}`);
    let deleteBtn = document.getElementById(`deleteTrip-${tripData.id}`);
    let tripForm = document.getElementById("trip-form");

    if (ui === "modal") {
        // save button functionality on the modal
        saveBtn.addEventListener("click", () => {
            let itineraryInfo = document.getElementById(`itinerary-${tripData.id}`).parentNode.innerHTML;
            // Copy the new trip object
            let newTrip = { ...tripData };
            // add itinerary info to newtrip object - for a prod app we would loop through child divs
            newTrip.itineraries = itineraryInfo;
            // if trip is new, add to global trips object otherwise replace
            let tripExists = tripsArray.some((trip) => trip.id === tripData.id);
            if (tripExists) {
                let replaceTrip = tripsArray.find((trip) => trip.id === tripData.id);
                tripsArray.splice(tripsArray.indexOf(replaceTrip), 1, newTrip);
                
                // update local storage w/ latest trip info
                localStorage.setItem("trips", JSON.stringify([]));
                localStorage.setItem("trips", JSON.stringify(tripsArray));
                // Save updated trip to Express server
                postTrip(`${serverURL}/updateEntry`, newTrip);
            }
            else {
                // add new trip to local storage
                tripsArray.push(newTrip);
                // Add new trip to local storage
                localStorage.setItem("trips", JSON.stringify(tripsArray));
                // Save new trip to Express server
                postTrip(`${serverURL}/addEntry`, newTrip);
            }
            // update trip entry with latest including itinerary info
            let savedTrip = document.createElement("div");
            savedTrip.classList.add("saved-trip");
            let updatedTrip = document.querySelector(".modal").innerHTML;
            savedTrip.innerHTML = updatedTrip;
            let savedTrips = document.getElementById("view-trips");
            savedTrips.prepend(savedTrip);
            savedTrips.scrollIntoView({ behavior: "smooth" });
            
            // Update UI            
            saveBtn.style.display = "none";
            updateBtn.style.display = "inline-block";
            
            document.querySelectorAll(".trip-container").forEach(el =>{
                el.style.overflowY = "hidden";
                el.style.overflowX = "hidden";
            });
            document.querySelectorAll(".daily-forecasts").forEach(el =>{
                el.style.paddingLeft = "0em";
            });
            document.querySelectorAll(".forecast-header").forEach(el =>{
                el.style.width = "74vw";
                el.style.maxWidth = "74vw";
            });
            document.querySelectorAll(".btn-group").forEach(el =>{
                el.style.marginLeft = 0;
            });
            let elems = [".itinerary-header",".itinerary-schedule",".itinerary-container"];
            for (let el of elems){
                hideElement(el);
            }
            document.querySelectorAll(".modal-details").forEach(el=>{
                el.style.borderLeft = "none";
            });
            // clear form and close modal
            tripForm.reset();
            setMinDates();
            closeModal();
            // call function to handle button behavior for the now saved Trip
            handleResult(savedTrip, tripData, "savedTrips");

            // future enhancement(s): sort the trips by start date

        });
        // delete button functionality on the modal
        deleteBtn.addEventListener("click", () => {
            deleteEntry(entry, tripData.id);
            tripForm.reset();
            setMinDates();
            closeModal();
        });
    } 
    // Handle buttons on the saved trip list container
    else if (ui == "savedTrips") {
        saveBtn.style.display = "none";
        updateBtn.style.display = "inline-block";
        
        // 'view' button functionality for viewing/updating existing trip
        updateBtn.addEventListener("click", () =>{
            let itineraryInfo = document.getElementById(`itinerary-${tripData.id}`).parentNode.innerHTML;
            let newTrip = { ...tripData };
            // add itinerary info to newtrip object - for a prod app we would loop through child divs
            newTrip.itineraries = itineraryInfo;
            displayTrip(newTrip, "updateTrip");

            entry.remove();
        })
        // delete button functionality for existing trips deletes trip from UI and local storage
        deleteBtn.addEventListener("click", () => {
            deleteEntry(entry, tripData.id);
        });
    }
};

/**
 * @description Delete trip entry
 * @param {*} entry - html trip container to be deleted from UI
 * @param {*} id - Trip id
 */
const deleteEntry = (entry, id) => {
    // if trip is previously saved, delete from storage & server, o/wise new trip only requires deletion from modal
    let removeTrip = tripsArray.find((trip) => trip.id === id);
    //console.log("removeTrip:", removeTrip);
    if(removeTrip){
        //console.log("trip exists and will be deleted from server & local storage");
        postTrip(`${serverURL}/delete`, { id });
        tripsArray.splice(tripsArray.indexOf(removeTrip), 1);
        entry.remove(removeTrip);
        localStorage.setItem("trips", JSON.stringify([]));
        localStorage.setItem("trips", JSON.stringify(tripsArray));
    }
    else{ 
        //console.log("trip not yet saved, so modal is simply cleared");
        entry.remove();
    }
}

/**
 * @description hide all elements of a certain class
 * @param {*} dataClass - classes to be affected
 */
const hideElement = (dataClass) => {
    document.querySelectorAll(dataClass).forEach(el =>{
        el.style.display = "none";});
};

/**
 * @description - Load/display saved trips from local storage if any
 */
const loadTrips = () => {
    if(tripsData){
    for (let trip of tripsData) {
        displayTrip(trip, "savedTrips");
    }
}
};

/**
 * @description - toggle modal display on for viewing new trip or updating saved trip
 */
function toggleModal() {
    let modal = document.querySelector(".modal");
    modal.classList.add("active");
}

/**
 * @description - close modal used when saving or deleting trip in modal
 */
function closeModal() {
    let modal = document.querySelector(".modal");
    modal.classList.remove("active");
    modal.innerHTML = "";
}

/**  
 * @description - POST fetch request to server
 * @param {*} url - designates which POST request to be made (api data retrieval / saving trip / deleting trip)
 * @param {*} data -  data for POST request (e.g. new trip form input data / trip to be saved or updated / trip id for deleting)
 * */
const postTrip = async (url = '', data = {}) => {
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

export { liveClocks }
export { handleSubmit }
