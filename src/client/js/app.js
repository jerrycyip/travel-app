import {validateTrip} from "./helper.js";

const serverURL = "http://localhost:8084/api";


const syncScroll = (event) => {
    //event.preventDefault();

    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    div1.scrollLeft = div2.scrollLeft*(div1.offsetWidth/div2.offsetWidth);
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

function dayOfWeek(date){
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let dt = new Date(`${date} 00:00:00`);
    return days[dt.getDay()];
}

function localTime(tZone) {
    let currentTime = new Date();
    //document.getElementById('txt').innerHTML =
/*    let timeHolder = document.createElement('span');
    timeHolder.classList.add("local-time");*/
    return currentTime.toLocaleString('en-US', { timeZone: tZone, hour: 'numeric', minute: 'numeric', hour12: true, year: '2-digit', month: 'numeric', day: 'numeric' });
    //var t = setTimeout(localTime(tZone), 500);
    //return t;
  }

 function dateString(date){
     let dt = new Date(`${date} 00:00:00`);
    return ((dt.getMonth() + 1)) + '/' + dt.getDate() + '/' + dt.getFullYear().toString().substr(-2);
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

            let tripHolder = document.createElement("div");
            tripHolder.className = "summary-wrapper";
            tripHolder.innerHTML = `
            <div class="trip-summary">
            <div class="trip-image">
            <img class = "trip-photo" src="${res.image}" alt="trip image">
       </div>
            <div class="modal-details">
                <h2 class="locale">${destination}</h2>
                <h3 class="dates">Depart:&nbsp<span id="depart-date">${dateString(start_dt)} (${dayOfWeek(start_dt)})</span></h3>
                <h3 class="dates">Return:&nbsp<span id="return-date">${dateString(end_dt)} (${dayOfWeek(end_dt)})</span></h3>
                <h3>Local Time:&nbsp<span class="local-time">${localTime(res.timeZone)}</span></h3>
                <h3><span class="countdown">${daysLeft(start_dt)} days until your trip</h3>
                <div class="btn-group">
                    <button class="trip-btn">Save Trip</button>
                    <button class="trip-btn">Delete Trip</button>
                </div>
            </div>
        </div>
            `
            //console.log(tripHolder);
            const modalContainer = document.querySelector(".modal-content");
            modalContainer.prepend(tripHolder);        
            
    
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
    let dd = new_end.getDate();
    let mm = ("0" + (new_end.getMonth() + 1)).slice(-2) //January is 0! & force 2 digit MM
    let yyyy = new_end.getFullYear();
    new_end = yyyy+'-'+mm+'-'+dd;
    
    document.getElementById("end").setAttribute("value", new_end);
    }
 else return;   
}

export{syncScroll}
//export {newEntry}
export {handleSubmit}
//export {stickyWeather}
