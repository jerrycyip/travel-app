# Travel App - FEND Capstone Project

## Project Description
This project is the final capstone for Udacity's Front End Web Developer Nanodegree program.  The project requirements are to build a travel application that uses Web APIs to pull data from Geonames, Weatherberbit and Pixabay.  Based on a user's input destination and travel dates, the application retrieves cooresponding geographical coordinates from Geonames, weather forecast data from Weatherbit, and destination image data from Pixabay.  As an extra feature, my application also pulls statistical weather forecast data for travel dates greater than 14 days in the future from the Visual Crossing weather API.  With the resulting API data, the application is dynamically updated to display the results to the user as well as provide a trip countdown, the current local time of the destination, and itinerary planning functionality.  HTML, CSS, JavaScript and NodeJS are employed for this project with specific requirements and implementation details provided below.  A screenshot and .gif of the resulting web app is also provided below for illustration purposes.

## Result

## Demo
![Travel App]

## Tools Required
Tools required to develop and run this project are as follows: 
- text editor (e.g. [Atom](https://atom.io/)) or Integrated Development Environment - IDE (e.g. MS Visual Studio)
- web browser (e.g. Chrome/Safari/Firefox)
- Node.js (for webserver functionality)
- 3rd party Node.js packages as listed in package.json, including (additional loaders and plugins listed in next section):
    - Webserver - Node.js
    - Express (Web application framework)
    - body-parser (middleware body parser)
    - cors (cross origin routing)
    - Webpack (Build Tool for setting up dev and prod environments)
    - Service Worker (External Script for offline functionality)
- free developers accounts from weatherbit.io, pixabay.com, geonames.org and visualcrossing.com (these are required if you wish to use your open API token for retrieving data)
- (not required) This project and related requirements was tracked and managed via the following [kanban board](https://trello.com/b/3R28aGDc/travel-app)

## Installation & Configuration

The following loaders and plugins were installed for development, with Service Workers installed for production only.
(Choose the necessary installation for your development mode and preferences)
- Install Webpack and the command line instructions (CLI) tool:
    npm i webpack webpack-cli 
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
- Install the following npm packages that are used by the express server:\
    npm i --save path\
    npm i --save body-parser\
    npm i --save cors
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
- Middleware functionality including GET and POST routines that correspond to the POST and GET calls from the browser aka client-side (as implemented by app.js).  Here, the planned trips comprise forecasted weather data, trip destination images and users' input itinerary data that are posted and retrieved.  The Node.js 'body-parser' package is used for json string parsing of the trip entry payloads.
- In addition, the Node.js 'cors' (cross origin resource sharing) package is also installed for communication with the front end application.

## Setting up the APIs

### Step 1: Signup for the API keys
This project uses the GeoNames API found [here](http://www.geonames.org/export/web-services.html) to retrieve latitude and longitude GPS coordinates given the user's input destination city.  The returned latitude and longitude values are inputs for a subsequent API call to retrieve 14-day weather forecast data from the Weatherbit API found [here](https://www.weatherbit.io/account/create).  In the case of travel dates extending beyond the next 14 dates (and/or starting on today's date), additional statistical weather forecast data from VisualCrossing API found [here](https://www.visualcrossing.com/weather-api) -- note, this is extra functionality beyond the scope of the project requirements .  Lastly, using the destination city name we retrieve associated image data from the Pixabay API found [here](https://pixabay.com/api/docs/).  For each of these APIs, a free developer's account must be created in order to obtain a free API key to start using the APIs. These APIs do not require SDKs, so set-up steps are minimal.

### Environment Variables
We configure our .gitignore file in order to declare the various API keys and ensure they remain private as opposed to publicly visible on GitHub environment when pushing to GitHub:

- [ ] Use npm or yarn to install the dotenv package ```npm install dotenv```. This will allow us to use environment variables we set in a new file
- [ ] Create a new ```.env``` file in the root of your project
- [ ] Go to your .gitignore file and add ```.env``` - this will make sure that we don't push our environment variables to Github! If you forget this step, all of the work we did to protect our API keys was pointless.
- [ ] Fill the .env file with your API keys like this:
```
API_ID=**************************
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
