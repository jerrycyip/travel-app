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