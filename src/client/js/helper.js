/**
 * @description - validate new trip form's input data
 * @param {string} locale - trip destination input value
 * @param {string} start - trip start date input value
 * @param {string} end - trip end date input value
 * @returns true or false 
 */
function validateTrip(locale, start, end){
    const trim_locale = locale.trim();
    let start_dt = new Date(start);
    let end_dt = new Date(end);
    //confirm trip destination is not empty and start date <= end date
    if(trim_locale !== "" && start_dt <= end_dt){
    return true;
    }
    else{
    return false
    }
}

/**
 * @description - sets live local clocks and live countdowns for each existing trip destination
 */
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

/**
 * @description - Abbreviate wind direction for UI display
 * @param {string} direction - full text string for wind direction
 * @returns abbreviated wind direction 
 */ 
function windDirShort(direction) {
    let shortDir = direction.replace(/est/g, "");
    shortDir = shortDir.replace(/ast/g, "");
    shortDir = shortDir.replace(/orth/g, "");
    shortDir = shortDir.replace(/outh/g, "");
    return shortDir.toUpperCase();
}

/**  
 * @description Convert km to miles
 * @param {number} amt - amount in kilometers (km) to convert
 * @returns amount converted to miles
 */
function kmToMi(amt) {
    return Math.round(amt / 1.609 * 10) / 10;
}

/** 
 * @description - Convert centimers to inches
 * @param {number} amt - amount in centimers to convert
 * @returns amount converted to inches
 */
function cmToIn(amt) {
    return Math.round(amt / 2.54 * 100) / 100;
}

/**  
 * @description - Calculate days until trip
 * @param {string} start - start date of trip
 * @param {end} end - end date of trip
 * @returns duration of trip in days
*/
function duration(start, end) {
    /* Note: to address Safari invalid date issue: \s metacharacter regex is used to find whitespace character to be replaced with 'T'
    https://stackoverflow.com/questions/4310953/invalid-date-in-safari
    */
    let startDt = new Date(`${start}T00:00:00`.replace(/\s/, 'T'));
    let endDt = new Date(`${end}T00:00:00`.replace(/\s/, 'T'));
    const oneDayMs = 24 * 60 * 60 * 1000; // millisec in a day
    
    let daysLeft = Math.round((endDt - startDt) / oneDayMs) + 1;
    return daysLeft
}

/**
 * @description - Determine the day of the week for a given date
 * @param {string} date - date
 * @returns day of the week (abbreviated string)
 */
function dayOfWeek(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let dt = new Date(`${date}T00:00:00`.replace(/\s/, 'T'));
    return days[dt.getDay()];
}

/**
 * @description - Determine the current local date for given timezone
 * @param {string} tZone - time zone
 * @returns current local date string
 */
function localDate(tZone) {
    let currentTime = new Date();
    return currentTime.toLocaleDateString('en-US', { timeZone: tZone, year: '2-digit', month: 'numeric', day: 'numeric' });
}

/**
 * @description - Determine the current local date, time and day of week for given timezone
 * @param {string} tZone - time zone
 * @returns current local date and time string plus day of week
 */
function localDateTime(tZone) {
    let currentTime = new Date();
    let localTime = currentTime.toLocaleTimeString('en-US', { timeZone: tZone, hour: 'numeric', minute: 'numeric', hour12: true, year: '2-digit', month: 'numeric', day: 'numeric', weekday: 'short' });
    let timeIndex = localTime.lastIndexOf(',') + 2;
    let dateIndex = localTime.indexOf(',') + 2;

    return localTime.slice(timeIndex) + ", " + localTime.slice(dateIndex, timeIndex - 2).slice(0,-3) + " (" + localTime.slice(0, dateIndex - 2) + ")";
}

/**
 * @description - Reformat date input to mm/dd/yy format for UI display
 * @param {string} date - Date to be reformatted
 * @returns reformatted date in mm/dd/yy format
 */
function dateString(date) {
    let dt = new Date(`${date}T00:00:00`.replace(/\s/, 'T'));
    return ((dt.getMonth() + 1)) + '/' + dt.getDate() + '/' + dt.getFullYear().toString().substr(-2);
}

/**
 * @description - Convert military time into standard time for UI display
 * @param {string} militaryTime
 * @returns time converted to standard time format
 */
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

/**
 * @description - Convert celcius to fahrenheight
 * @param {number} temp - temperature in degrees celcius
 * @returns temperature converted to fahrenheit
 */
function cToF(temp) {
    return Math.round((temp * 9 / 5)) + 32;
}

/**
 * @description - determine countdown message with number of days left
 * @param {string} start - start date of trip
 * @param {string} tzone - time zone of trip destination
 * @returns countdown message with numbers of days left
 */
function ctDown(start, tzone) {
    let today = new Date();
    let todayDt = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    todayDt = new Date(todayDt);
    let startDt = new Date(`${start}T00:00:00`.replace(/\s/, 'T'));
    const oneDayMs = 24 * 60 * 60 * 1000; // millisec in a day
    let countdown = Math.round((startDt - todayDt) / oneDayMs);

    let localDt = new Date(localDate(tzone));
    let begunAlready = (startDt < localDt);
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

/**  
 * @description - Set default minimum start and end dates for new trip form
 * 
 */
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

/**
 * @description - set minimum end date for new trip form as start date and default as day after start date 
 * @returns nothing 
 */
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
export {setClocks, setMinDates, setEndMin, windDirShort, kmToMi, cmToIn, duration, dayOfWeek, localDateTime,
    cToF, toStandardTime, dateString, ctDown}