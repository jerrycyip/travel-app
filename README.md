# Travel App - FEND Capstone Project

## Project Description
This project is the final capstone for Udacity's Front End Web Developer Nanodegree program.  The project requirements are to build a travel application that uses Web APIs to pull data from Geonames, Weatherberbit and Pixabay.  Based on a user's input destination and travel dates, the application retrieves cooresponding geographical coordinates from Geonames, weather forecast data from Weatherbit, and destination image data from Pixabay.  As an extra feature, my application also pulls statistical weather forecast data for travel dates greater than 14 days in the future from the Visual Crossing weather API.  With the resulting API data, the application is dynamically updated to display the results to the user as well as provide a trip countdown, the current local time of the destination, and itinerary planning functionality.  HTML, CSS, JavaScript and NodeJS are employed for this project with specific requirements and implementation details provided below.  A screenshot and gif of the resulting web app is also provided below for illustration purposes.

## Tools Required
Tools required to develop and run this project are as follows: 
- text editor (e.g. [Atom](https://atom.io/)) or Integrated Development Environment - IDE (e.g. MS Visual Studio)
- web browser (e.g. Chrome/Safari/Firefox)
- Node.js (for webserver functionality)
- 3rd party Node.js packages as listed in package.json, including:
    - Webserver - Node.js
    - Express (Web application framework)
    - body-parser (middleware body parser)
    - cors (cross origin routing)
    - Webpack (Build Tool for setting up dev and prod environments)
    - Service Worker (External Script for offline functionality)
- free developers accounts from weatherbit.io, pixabay.com, geonames.org and visualcrossing.com (these are required if you wish to use your open API token for retrieving data)

## Development & Instructions
### HTML
The main landing page (aka homepage) is accessed via the index.html file and comprises an initial trip planning input form along with cards showing summary data of previously planned trips.

### CSS
The supporting css files governs overall layout of the site including media queries for mobile responsive functionality.

### JavaScript: app.js
The supporting javascript file, "app.js", controls dynamic functionality on the landing page including: 
- population of the current date
- retrieval (GET) of the current weather data from openweathermap.org (retrieves the API for current weather by zip: https://openweathermap.org/current#zip)
- browser aka client-side post (POST) and retrieval (GET) of said weather data plus user journal entries to a local express server for storing and retrieving data.  
### JavaScript: server.js
The backend server file, "server.js", employs the Node.js web application framework 'Express' for setting up a local server.  Note, as the scope of this project does not implement any dedicated backend datastore (e.g. database) as a complement to the local server, this setup mainly serves local testing and development purposes rather than implementing true data persistence (e.g. across server restarts/user sessions etc). Functionality provided includes:
- Basic routing for loading the main landing page (as provided by index.html).
- Middleware functionality including GET and POST routines that correspond to the POST and GET calls from the browser aka client-side (as implemented by app.js).  Here, the journal entries comprising weather data and user's input are posted and retrieved.  The Node.js 'body-parser' package is used for json string parsing of the journal entry payloads.  
- In addition, the Node.js 'cors' (cross origin resource sharing) package is also installed.  That said, as requests to openweathermap.org are made from the browser/client-side and not the server, the installation of the cors package is employed as more of an exercise for how real world applications are implemented.

## Web App Result
![Weather Journal App](/weather_journal_preview.png)

## Mobile View Result
![Weather Journal App Mobile](/weather_journal_mobile.png)
