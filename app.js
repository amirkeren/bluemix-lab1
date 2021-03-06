/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

const DATABASE_ERROR = 'Database undefined';
const PARAMETER_ERROR = 'Parameter is missing';

// this application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// bodyParser provides access to the query request parameters
var bodyParser = require('body-parser');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// for parsing request parameters
app.use(bodyParser.urlencoded({
  extended: true
}));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

// will hold the database object
var db;

// endpoint for retrieving all phrases
app.get('/getPhrases', function(req, res) {
  // TODO - implement and remove the line below
  console.log('Endpoint not implemented yet');
  res.send('No Phrases Found'); // temporary return value
});

// endpoint for adding a new phrase
app.post('/addPhrase', function(req, res) {
  // TODO - implement and remove the line below
  console.log('Endpoint not implemented yet');
  res.sendStatus(500); // temporary return value
});
