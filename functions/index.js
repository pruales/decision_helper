'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

// a. the action name from the make_name Dialogflow intent
const NAME_ACTION = 'make_decision';
// b. the parameters that are parsed from the make_name intent 
const NAME_ARGUMENT = 'given-name';
const TIME_PERIOD_ARGUMENT = 'time_period';
const COMMITMENT_ARGUMENT = 'commitment_level';


exports.decisionMaker = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));


// c. The function that evaluated decion state
  function makeDecision (app) {
    let name = app.getArgument(NAME_ARGUMENT);
    let timePeriod = app.getArgument(TIME_PERIOD_ARGUMENT);
    let commitmentLevel = app.getArgument(COMMITMENT_ARGUMENT);
    app.tell('Alright '+name+','+' you have thought about this for ' + timePeriod + ' days!' +
        'On a scale of 1-10 you have rated your commitment as a ' +  commitmentLevel);

  }
  // d. build an action map, which maps intent names to functions
  let actionMap = new Map();
  actionMap.set(NAME_ACTION, makeDecision);


app.handleRequest(actionMap);
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
