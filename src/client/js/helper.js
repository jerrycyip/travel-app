function validateTrip(locale, start, end){
    const trim_locale = locale.trim();
    if(trim_locale !== "" && start <= end){
    return true;
    }
    else{
    return false
    }
}

function setClocks() {
    let clocks = document.querySelectorAll(".local-time");
    let ctdowns = document.querySelectorAll("h3.countdown");

    for (let clock of clocks) {
        let tzone = Object.keys(clock.dataset).toString().replace(`_`, `/`);
        clock.innerHTML = localDateTime(tzone);
    }
    for (let ctdown of ctdowns) {
        let dataAtts = Object.keys(ctdown.dataset);
        let tzone = dataAtts[0].toString().replace(`_`, `/`);
        let startDt = dataAtts[1];
        let countdownMsg = ctDown(startDt, tzone);
        ctdown.innerHTML = countdownMsg;
    }
}
// Abbreviate wind direction
function windDirShort(direction) {
    let shortDir = direction.replace(/est/g, "");
    shortDir = shortDir.replace(/ast/g, "");
    shortDir = shortDir.replace(/orth/g, "");
    shortDir = shortDir.replace(/outh/g, "");
    return shortDir.toUpperCase();
}

// convert km to miles
function kmToMi(amt) {
    return Math.round(amt / 1.609 * 10) / 10;
}
// convert centimers to inches
function cmToIn(amt) {
    return Math.round(amt / 2.54 * 100) / 100;
}
// calculate days until trip
function daysLeft(start) {
    console.log("daysLeft called with:", start);
    let today = new Date();
    let todayDt = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    todayDt = new Date(todayDt);

    let startDt = new Date(`${start}T00:00:00`.replace(/\s/, 'T'));
    const oneDayMs = 24 * 60 * 60 * 1000; // millisec in a day
    let daysRemaining = Math.round((startDt - todayDt) / oneDayMs);
    return daysRemaining;
}

// calculate days until trip
function duration(start, end) {
    let startDt = new Date(`${start}T00:00:00`.replace(/\s/, 'T'));
    let endDt = new Date(`${end}T00:00:00`.replace(/\s/, 'T'));
    const oneDayMs = 24 * 60 * 60 * 1000; // millisec in a day
    daysLeft = Math.round((endDt - startDt) / oneDayMs) + 1;
    return daysLeft
}

function dayOfWeek(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let dt = new Date(`${date}T00:00:00`.replace(/\s/, 'T'));
    return days[dt.getDay()];
}

function localDate(tZone) {
    let currentTime = new Date();
    return currentTime.toLocaleDateString('en-US', { timeZone: tZone, year: '2-digit', month: 'numeric', day: 'numeric' });
}

function localDateTime(tZone) {
    let currentTime = new Date();
    let localTime = currentTime.toLocaleTimeString('en-US', { timeZone: tZone, hour: 'numeric', minute: 'numeric', hour12: true, year: '2-digit', month: 'numeric', day: 'numeric', weekday: 'short' });
    let timeIndex = localTime.lastIndexOf(',') + 2;
    let dateIndex = localTime.indexOf(',') + 2;
    //console.log(localTime.slice(timeIndex) + localTime.slice(dateIndex, timeIndex-2) + localTime.slice(0, dateIndex-2))
    return localTime.slice(timeIndex) + ", " + localTime.slice(dateIndex, timeIndex - 2).slice(0,-3) + " (" + localTime.slice(0, dateIndex - 2) + ")";
}

function dateString(date) {
    let dt = new Date(`${date}T00:00:00`.replace(/\s/, 'T'));
    return ((dt.getMonth() + 1)) + '/' + dt.getDate() + '/' + dt.getFullYear().toString().substr(-2);
}

function toStandardTime(militaryTime) {
    let timeArray = militaryTime.split(':');
    if (timeArray[0].charAt(0) == 1 && timeArray[0].charAt(1) > 2) {
        return (timeArray[0] - 12) + ':' + timeArray[1] + ' PM';
    }
    else {
        if (timeArray[0].charAt(0) == 0) {
            return timeArray[0].slice(1) + ':' + timeArray[1] + ' AM';
        }
        else {
            return timeArray[0] + ':' + timeArray[1] + ' AM';
        }
    }
}

function cToF(temp) {
    return Math.round((temp * 9 / 5)) + 32;
}




function ctDown(start, tzone) {
    //let countdown = daysLeft(start); /* for some reason this call fails*/
    let today = new Date();
    let todayDt = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    todayDt = new Date(todayDt);
    let startDt = new Date(`${start}T00:00:00`.replace(/\s/, 'T'));
    const oneDayMs = 24 * 60 * 60 * 1000; // millisec in a day
    let countdown = Math.round((startDt - todayDt) / oneDayMs);


    //console.log("localDate:", localDate(tzone));
    let localDt = new Date(localDate(tzone));
    //let startDt = new Date(`${start}T00:00:00`.replace(/\s/, 'T'));
    //console.log("localDt:", localDt);
    // console.log("startDt:", startDt);
    let begunAlready = (startDt < localDt);
    // console.log("begunAlready", begunAlready)
    let countdownMsg = "";
    if (begunAlready) {
        countdownMsg = `Your trip has started!`;
        return countdownMsg;
    }
    else {
        switch (countdown) {
            case 0:
                countdownMsg = `Your trip starts today!`;
                return countdownMsg;
                break;
            case 1:
                countdownMsg = `${countdown} day until your trip!`;
                return countdownMsg;
                break;
            default:
                countdownMsg = `${countdown} days until your trip`;
                return countdownMsg;
        }
    }
}

// Set minimum dates for trip
function setMinDates() {
    let today = new Date();
    let tm = new Date(today);
    tm.setDate(tm.getDate() + 1);
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    let dd2 = tm.getDate();
    let mm2 = tm.getMonth() + 1;
    let yyyy2 = tm.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    if (dd2 < 10) {
        dd2 = '0' + dd2
    }
    if (mm2 < 10) {
        mm2 = '0' + mm2
    }
    today = yyyy + '-' + mm + '-' + dd;
    tm = yyyy2 + '-' + mm2 + '-' + dd2;

    document.getElementById('start').setAttribute("min", today);
    document.getElementById('start').setAttribute("value", today);

    document.getElementById('end').setAttribute("min", today);
    document.getElementById('end').setAttribute("value", tm);
}

function setEndMin() {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    document.getElementById("end").setAttribute("min", start);

    if (end < start) {
        let new_end = new Date(start);
        new_end.setDate(new_end.getDate() + 2);
        let dd = ("0" + new_end.getDate()).slice(-2);
        let mm = ("0" + (new_end.getMonth() + 1)).slice(-2) //January is 0! & force 2 digit MM
        let yyyy = new_end.getFullYear();
        new_end = yyyy + '-' + mm + '-' + dd;

        document.getElementById("end").setAttribute("value", new_end);
    }
    else return;
}

export { validateTrip }
export {setClocks, setMinDates, setEndMin, windDirShort, kmToMi, cmToIn, daysLeft, duration, dayOfWeek, localDate, localDateTime,
    cToF, toStandardTime, dateString, ctDown}