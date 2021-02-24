import { droplet2 } from "../index.js";
import { snowflake } from "../index.js";
import { wind } from "../index.js";
import { sunshine } from "../index.js";
import { weatherIcons } from "../index.js";
//import {cameraTravel} from  "../index.js";
import {validateTrip, setClocks, setMinDates, setEndMin, windDirShort, kmToMi, 
    cmToIn, daysLeft, duration, dayOfWeek, localDate, localDateTime,
    cToF, toStandardTime, dateString, ctDown} from "./helper.js";
/** 
 * Set Global variables 
 * 
*/

const serverURL = "http://localhost:8084";
let newTrip = {};
let tripList = document.getElementById(".view-trips");
//let modal = document.querySelector(".modal");

// Check for existing trips in local storage
let tripsArray = localStorage.getItem("trips")
    ? JSON.parse(localStorage.getItem("trips"))
    : [];
const tripsData = JSON.parse(localStorage.getItem("trips"));


// set live clocks and countdowns for different trip destinations
let liveClocks = setInterval(setClocks, 30000);
document.addEventListener("onload", setMinDates());
document.getElementById('start').addEventListener('change', setEndMin);

// main function for new trip submission
const handleSubmit = async (event) => {
    event.preventDefault();

    const locale = document.getElementById('destination').value;
    const start_dt = document.forms['trip-form']['start'].value;
    const end_dt = document.forms['trip-form']['end'].value;

    if (validateTrip(locale, start_dt, end_dt)) {
        // api GET call to geonames api with destination name
        let res = await postTrip(`${serverURL}/api`, { destination: locale, start: start_dt, end: end_dt })
        //update UI w/ the trip info 
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

    if(tripData.image == "none"){
        tripData.image = "/imgs/camera-travel.jpg"; 
    }
    // define startDt and endDt as used by o/ functions for display
    let startDt = new Date(`${start_dt}T00:00:00`.replace(/\s/, 'T'));
    let endDt = new Date(`${end_dt}T00:00:00`.replace(/\s/, 'T'));

    // create trip info
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
    // load forecast and itinerary data
    // define containers for forecast and itinerary data    
    let dailyForecasts = ``;
    let dailyItineraries = ``;
    // define dt counter for loop logic
    let dt = new Date(`${start_dt}T00:00:00`.replace(/\s/, 'T'));    
    while (dt.getTime() <= endDt.getTime()) {
        let dateStr = (dt.getMonth() + 1) + '/' + dt.getDate();
        let dateStr2 = (dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2));
        let snowing = tripData.weather[dateStr2].description.toLowerCase().includes('snow');
        let precipIcon = snowing ? snowflake : droplet2;

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
    /* If saved trip, overwrite with existing itinerary info */
    
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
    
    newTrip = newTrip + dailyDetail + dailyForecasts + itineraryHeader + dailyItineraries + closer;
    let tripContainer = document.createElement("div");
    tripContainer.classList.add("trip-container");
    tripContainer.innerHTML = newTrip;

    if (type =="modal" || type == "updateTrip" ) {
        toggleModal();
        let modalContainer = document.querySelector(".modal");
        // revisit if this id assignment is necessary
        //modalContainer.id = tripData.id;
        modalContainer.append(tripContainer);
        handleResult(tripContainer, tripData, "modal");
    }
    else{
        let savedTrip = document.createElement("div");
        savedTrip.classList.add("saved-trip");
        savedTrip.append(tripContainer);

        let savedTrips = document.getElementById("view-trips");
        savedTrips.prepend(savedTrip);
        // style UI for saved Trips
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
        // revisit if passing savedTrip vs tripContainer is okay
        handleResult(savedTrip, tripData, "savedTrips");
    }
}

/* Handle next steps for new and existing trips
*/
export const handleResult = async (entry, tripData, ui) => {
    let saveBtn = document.getElementById(`saveTrip-${tripData.id}`);
    let updateBtn = document.getElementById(`updateTrip-${tripData.id}`);
    let deleteBtn = document.getElementById(`deleteTrip-${tripData.id}`);
    let tripForm = document.getElementById("trip-form");

    if (ui === "modal") {
        // Handle buttons on the modal
        saveBtn.addEventListener("click", () => {
            let itineraryInfo = document.getElementById(`itinerary-${tripData.id}`).parentNode.innerHTML;
            // Copy the new trip object
            let newTrip = { ...tripData };
            // add itinerary info to newtrip object - for prod app would loop through child divs
            newTrip.itineraries = itineraryInfo;
            // if trip is new, add to global trips object otherwise replace
            let tripExists = tripsArray.some((trip) => trip.id === tripData.id);
            if (tripExists) {
                let replaceTrip = tripsArray.find((trip) => trip.id === tripData.id);
                tripsArray.splice(tripsArray.indexOf(replaceTrip), 1, newTrip);
                
                // revisit deletion of modal content
                /*postTrip(`${serverURL}/delete`, {id});*/

                localStorage.setItem("trips", JSON.stringify([]));
                localStorage.setItem("trips", JSON.stringify(tripsArray));
                // Save updated trip to Express server
                postTrip(`${serverURL}/updateEntry`, newTrip);
            }
            else {
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
            closeModal(entry);
            handleResult(savedTrip, tripData, "saved-trips");
            //tripList.prepend(savedTrip);

            // sort the trips by start date

        });

        deleteBtn.addEventListener("click", () => {
            deleteEntry(entry, tripData.id);
            tripForm.reset();
            closeModal(entry);
        });
    } 
    else {
        // revisit differentiate deleting previously loaded trips and first time saved trips

        // Handle buttons on the saved trip list container
        saveBtn.style.display = "none";
        updateBtn.style.display = "inline-block";

        
        updateBtn.addEventListener("click", () =>{
            let itineraryInfo = document.getElementById(`itinerary-${tripData.id}`).parentNode.innerHTML;
            let newTrip = { ...tripData };
            // add itinerary info to newtrip object - for prod app would loop through child divs
            newTrip.itineraries = itineraryInfo;
            displayTrip(newTrip, "updateTrip");
            /*window.scroll({
                top: 0, 
                left: 0, 
                behavior: 'auto' 
               });*/
            entry.remove();
        })
        /*updateBtn.addEventListener("click"), () => {
            //loadEntry(entry)
        }
        */
        // Delete the selected trip entry from UI and local storage
        deleteBtn.addEventListener("click", () => {
            deleteEntry(entry, tripData.id);
        });
    }
};

/**
 * @description Delete trip entry
 * @param {*} entry - Element to be deleted
 * @param {*} id - Trip id
 */

const deleteEntry = (entry, id) => {
    // if trip is previously saved delete from storage & server, o/wise only from modal
    let removeTrip = tripsArray.find((trip) => trip.id === id);
    console.log("removeTrip:", removeTrip);
    if(removeTrip){
        console.log("trip exists and will be deleted from server & local storage");
        postTrip(`${serverURL}/delete`, { id });
        tripsArray.splice(tripsArray.indexOf(removeTrip), 1);
        entry.remove(removeTrip);
        localStorage.setItem("trips", JSON.stringify([]));
        localStorage.setItem("trips", JSON.stringify(tripsArray));
    }
    else{ 
        console.log("trip not yet saved, so modal is simply cleared");
        entry.remove();
    }
}

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

window.onload = () => loadTrips();
//document.addEventListener("onload", loadTrips());
//document.addEventListiner("onload", liveClocks());


function toggleModal() {
    let modal = document.querySelector(".modal");
    //modal.classList.toggle("display-off");
    modal.classList.add("active");
}

function closeModal(entry) {
    let modal = document.querySelector(".modal");
    //modal.classList.add("display-off");
    modal.classList.remove("active");
    // revisit whether this needs to be entry.remove instead
    modal.innerHTML = "";
    

}
// Post fetch request to server with provided trip details
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
//export {newEntry}
export { handleSubmit }
//export {stickyWeather}
