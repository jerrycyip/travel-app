# Travel Planner App

## Result - Demo
![Travel App](travel-app-demo.gif)

## Application Description
This project is for a travel planner web app combining itineraries, weather forecasts, and destination images in a unified dashboard.  The web app uses Web APIs to pull data from Geonames, Weatherberbit and Pixabay.  Based on a user's input destination and travel dates, the application retrieves cooresponding geographical coordinates from Geonames, weather forecast data from Weatherbit, and destination image data from Pixabay.  As a differentiating feature, the app also pulls statistical weather forecast data for travel dates greater than 14 days in the future from the Visual Crossing weather API.  With the resulting API data, the application is dynamically updated to display the results to the user as well as provide a trip countdown, the current local time of the destination, and itinerary planning functionality.  HTML, CSS, JavaScript and NodeJS are employed for this project with specific requirements and implementation details provided below.  A demo .gif of the resulting web app is also provided above for illustration purposes.


## Tools Required
Tools required to develop and run this project are as follows: 
- text editor (e.g. [Atom](https://atom.io/)) or Integrated Development Environment - IDE (e.g. MS Visual Studio)
- web browser (e.g. Chrome/Safari/Firefox)
- Node.js
- 3rd party Node.js packages as listed in package.json, including (additional loaders and plugins listed in next section):
    - Express
    - body-parser (middleware body parser)
    - cors (cross origin routing)
    - Webpack (Build Tool for setting up dev and prod environments)
    - Service Worker (External Script for offline functionality)
    - Jest (unit testing)
    - SuperTest (unit testing of Express Server)
- free developers accounts from weatherbit.io, pixabay.com, geonames.org and visualcrossing.com (these are required if you wish to use your open API token for retrieving data)
- (not required) This project and related requirements was tracked and managed via the following [kanban board](https://trello.com/b/3R28aGDc/travel-app)

## Installation & Configuration

The following loaders and plugins were installed for development, with Service Workers installed for production only.
(Choose the necessary installation for your development mode and preferences)
- Install Webpack and the command line instructions (CLI) tool for dev and prod:
    npm i webpack webpack-cli 
- Install the following npm packages that are used by the express server for dev & prod:\
    npm i --save path\
    npm i --save body-parser\
    npm i --save cors    
- (Babel: for transpiling ECMA2016+ JavaScript to standard JavaScript)\
    npm i -D @babel/core @babel/preset-env babel-loader\
    (short for "npm install --save-dev @babel/core @babel/preset-env babel-loader")
- (For creating separate designated css file that is transpiled from SASS)\
    npm i -D style-loader node-sass css-loader sass-loader
- (For hot/live reloading of the page, only for Development mode, and automatically re-build of the application)
    npm i -D webpack-dev-server
- (To automate replacement of 'dist' folder with new bundled assets each time we rerun webpack build scripts)\
    npm i -D clean-webpack-plugin
- (For automatically including reference to bundled Javascript bundle in a script tag in our html file)\
    npm i -D html-webpack-plugin
- (For css file minification for performance and website load size management)\
    npm i -D mini-css-extract-plugin
    npm i -D optimize-css-assets-webpack-plugin terser-webpack-plugin
- (Inclusion of images/logos on site )\
    npm i -D file-loader
    npm i -D html-loader
- Install fetch-node (or alternatively axios) for making api fetch requests to 3rd party APIs\
    npm i fetch-node --save-dev    
    
## Development & Instructions
### HTML
The main landing page (aka homepage) is accessed via the index.html file and comprises an initial trip planning input form along with cards showing summary data of previously planned trips.

### CSS
The supporting css files govern overall layout of the site including media queries for mobile responsive functionality.

### JavaScript: app.js
The supporting javascript file, "app.js", controls dynamic functionality on the landing page including: 
- setting live clocks for previously planned trip destinations
- setting live countdowns for previously planned trips
- setting default minimum dates (today's date) for the new trip planning form
- retrieval (GET) of the geocoordinates of the trip destination from the Geonames api
- retrieval (GET) of the weather forecast data from the Weatherbit API for the next 14 days
- retrieval (GET) of extended statistical weather forecast data from the VisualCrossing API for dates beyond 14 days as well as today's date (in the event the trip starts today)
- retrieval (GET) of an image of the travel destination from Pixabay or a default image if none is found.
- browser aka client-side post (POST) and retrieval (GET) of planned trip data including user input itinerary information to a local express server for storing and retrieving data.

### JavaScript: server.js
The backend server file, "server.js", employs the Node.js web application framework 'Express' for setting up a local server.  Note, as the scope of this project does not implement any dedicated backend datastore (e.g. database) as a complement to the local server, this setup mainly serves local testing and development purposes rather than implementing true data persistence (e.g. across server restarts/user sessions/devices etc). Functionality provided includes:
- Basic routing for loading the main landing page (as provided by index.html).
- Middleware functionality including GET and POST routines that correspond to the GET and POST calls from the browser aka client-side (as implemented by app.js).  Here, the planned trips comprise forecasted weather data, trip destination images and users' input itinerary data that are posted and retrieved.  The Node.js 'body-parser' package is used for json string parsing of the trip entry payloads.
- In addition, the Node.js 'cors' (cross origin resource sharing) package is also installed for communication with the front end application.

### Webpack Set Up Instructions
- Create your src folder first. The src folder should contain a client folder and a server folder.
- Your server folder should contain your server.js content.
- Your client folder should contain a js folder, media folder, styles folder, and views folder, as well as an index.js file.
- Your application js should go into the js file, your css into styles, and your index.html into views.
- Convert your stylesheet from a .css file to a .scss file
- Remember that webpack builds a dist file. You’ll need to update your server js to access the dist folder. (Hint: app.use(express...))
- Your index.js file inside the client folder should import the main function of your application javascript, it should import your scss, and it should export your main function from your application javascript. But in order to import, where will you need to export it?
- Instead of adding event listeners to the trip form submit button itself, this project uses .addEventListener(). Since we are exporting functions from our application.js file, our event listeners can’t go there.
- Now that your src folder is set up, it’s time to get webpack going. As per dependencies listed in the Installation & Configuration section above, we need to add babel, babel loader, css loader, file loader, html loader, html webpack plugin, node sass, sass loader, style loader, webpack, webpack cli, and webpack dev server. 
- Next, update the scripts in package.json. You will want to have test, dev, start, and build. NOTE: Start will be for your express server, dev will be so that you can take advantage of web dev server. It is possible depending on your setup to run both of these with one command.
- Get your webpack config set up. 
- To get webpack running, you’ll want to first run npm run dev, then npm build to get your dist folder created. Once that is created you can run npm run dev and npm start simultaneously to have hot loading of your project as well as a working express environment.

## Setting up the APIs

### Step 1: Sign-up for developer API keys
This project uses the GeoNames API found [here](http://www.geonames.org/export/web-services.html) to retrieve latitude and longitude GPS coordinates given the user's input destination city.  The returned latitude and longitude values are inputs for a subsequent API call to retrieve 14-day weather forecast data from the Weatherbit API found [here](https://www.weatherbit.io/account/create).  In the case of travel dates extending beyond the next 14 dates (and/or starting on today's date), additional statistical weather forecast data from VisualCrossing API found [here](https://www.visualcrossing.com/weather-api) -- note, this is extra functionality beyond the scope of the project requirements .  Lastly, using the destination city name we retrieve associated image data from the Pixabay API found [here](https://pixabay.com/api/docs/).  For each of these APIs, a free developer's account must be created in order to obtain a free API key to start using the APIs. These APIs do not require SDKs, so set-up steps are minimal.

### Step 2: Environment Variables
We configure our .gitignore file in order to declare the various API keys and ensure they remain private as opposed to publicly visible on GitHub environment when pushing to GitHub.  Note, for some of the 3rd Party API providers (e.g. Geonames) your username may serve as your API key:

- [ ] Use npm or yarn to install the dotenv package ```npm install dotenv```. This will allow us to use environment variables we set in a new file
- [ ] Create a new ```.env``` file in the root of your project
- [ ] Go to your .gitignore file and add ```.env``` - this will make sure that we don't push our environment variables to Github! If you forget this step, all of the work we did to protect our API keys was pointless.
- [ ] Fill the .env file with your API keys like this:
```
API_KEY=**************************
```
- [ ] Add this code to the very top of your server/index.js file:
```
const dotenv = require('dotenv');
dotenv.config();
```
- [ ] Reference variables you created in the .env file by putting ```process.env``` in front of it, an example might look like this:
```
console.log(`Your API key is ${process.env.API_KEY}`);
```
### Step 3: After adding APIs
Once we are hooked up to the different 3rd party APIs, we are half way there! Here are a few other steps to complete prior to deployment.

- Parse the response body to dynamically fill content on the page.
- Test that the server and new trip form submission work, making sure to also handle error responses if the user input does not match API requirements (e.g. default image returned if none found for an obscure location).
- Go back to the web pack prod config and add the setup for service workers:
    npm i -D workbox-webpack-plugin
- Test that the (prod) site is now available even when you stop your local server

## Additional Project Features
As part of the project requirements, at least one additional piece of functionality needed to be added.  The following additional features were implemented as part of this project:
- Support for user input end date and displaying the calculated length (duration) of the trip.
- Allowing the user to remove and view existing (previously planned) trips.
- Using [Local Storage](https://www.taniarascia.com/how-to-use-local-storage-with-javascript/) to save the data on the user's front end client (e.g. browser) so that when they close the application, then revisit the page in the same browser, their information is still there.
- Instead of just pulling a single day's forecast, pulling the forecast for the entire length of the trip.
- Incorporating weather icons into the forecast data.
- Allowing the user to add an itinerary for their trip.
- Allowing the user to add multiple trips via a save button for viewing later (view button).

## Future Enhancement(s)

Checkout [Netlify](https://www.netlify.com/) or [Heroku](https://www.heroku.com/) for ideas on free hosting options.


