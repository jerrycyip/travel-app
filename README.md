# Weather-Journal App Project

## Project Description
This project is part of Udacity's Front End Web Developer Nanodegree program.  The project requirements are to create an asynchronous web app that uses Web APIs from openweathermap.org and user input data to dynamically update the User Interface (UI) and capture user journal entries combined with the current weather conditions.  HTML, CSS, JavaScript and NodeJS are employed for this implementation with specific requirements and implementation details provided below.  A screenshot of the resulting web app is also provided below for illustration purposes.

## Tools Required
Tools required to develop and run this project, are as follows: 
- text editor (e.g. [Atom](https://atom.io/)) or Integrated Development Environment - IDE (e.g. MS Visual Studio)
- web browser (e.g. Chrome/Safari/Firefox)
- Node.js
- 3rd party Node.js packages: express, body-parser, cors (Note: these package dependencies are captured in the package.json file with actual packages included in the node_modules folder)
- a free developers account from openweathermap.org (required only if you wish to use your open API token for retrieving data)

## Development & Instructions
### HTML
The main landing page (aka homepage) is accessed via the index.html file and comprises a series of cards that allow for adding new journal entries as well as viewing the latest journal entry.

### CSS
The supporting css file governs overall layout of the site including media queries for mobile responsive functionality.

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
