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