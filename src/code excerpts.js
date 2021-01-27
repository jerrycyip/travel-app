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


        
        <div class="test-itinerary">
        <div class="itinerary-timeline">7 AM</div>
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
        <div class="itinerary-timeline">11 PM</div>
        <div class="itinerary-more">
            <button class="expander">[ + ]</button>
        </div> 
    </div>