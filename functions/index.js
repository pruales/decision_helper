'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client


// a. the action name from the make_name Dialogflow intent
const NAME_ACTION = 'make_decision';
// b. the parameters that are parsed from the make_name intent 
const NAME_ARGUMENT = 'given_name';
const TIME_PERIOD_ARGUMENT = 'time_period';
const COMMITMENT_ARGUMENT = 'commitment_level';
const PHYSICAL_FEELING_ARGUMENT = 'physical_feeling';
const GOALS_ARGUMENT = 'goals_aligned';
const RISKS_ARGUMENT = 'decision_risks';
const OPPOSITE_RISKS_ARGUMENT = 'opposite_risks';
const TIME_EVALUATION_ARGUMENT = 'right_time';
const PAST_EXPERIENCES_ARGUMENT = 'past_experiences';
const FUN_ARGUMENT = 'determine_fun';
const SENTIMENT_ARGUMENT = 'sentiment';

exports.decisionMaker = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  const client = new language.LanguageServiceClient();
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));


// c. The function that evaluated decion state
  function makeDecision (app) {
    let sentiment = app.getArgument(SENTIMENT_ARGUMENT);
    let name = app.getArgument(NAME_ARGUMENT);
    let timePeriod = app.getArgument(TIME_PERIOD_ARGUMENT);
    let commitmentLevel = app.getArgument(COMMITMENT_ARGUMENT);
    let physicalFeeling= app.getArgument(PHYSICAL_FEELING_ARGUMENT);
    let goalAlignment = app.getArgument(GOALS_ARGUMENT);
    let riskLevel = app.getArgument(RISKS_ARGUMENT);
    let reverseRisk = app.getArgument(OPPOSITE_RISKS_ARGUMENT);
    let correctTime = app.getArgument(TIME_EVALUATION_ARGUMENT);
    let pastExperience = app.getArgument(PAST_EXPERIENCES_ARGUMENT);
    let determineFun = app.getArgument(FUN_ARGUMENT);

    let text = sentiment + ' ' + physicalFeeling;
      
    response = '';


    const document = {
  	content: text,
  	type: 'PLAIN_TEXT',
    };

      // Detects the sentiment of the text
      //
      client
          .analyzeSentiment({document: document})
          .then(results => {
              const sentiment = results[0].documentSentiment;

              console.log(`Text: ${text}`);
              console.log(`Sentiment score: ${sentiment.score}`);
              console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

              //response+=`We sensed your sentiment to be ${sentiment.score}. `;

              if(correctTime=='Yes'){
                  var answerTime = 'a good';

              }
              else if(correctTime=='No'){
                  var answerTime = 'not a good';
              }
              //********************
              var x = 0;
              var timeString = timePeriod.unit;
              console.log(timeString);
              console.log(timeString.indexOf("day") !== -1);

              if (sentiment.score > 0){
                  x += 1;
              }

// ----SECONDS MINUTES HOURS
              if ((timeString == "s(s)") || (timeString == "min") ||
                  (timeString.indexOf("h") !== -1)) {

                  if (commitmentLevel >= 8) {
                      x += 1;
                  }
                  if (physicalFeeling !== null) {
                      x += 0;
                  }
                  if (goalAlignment !== null) {
                      var goalString = goalAlignment;
                      if (goalAlignment.indexOf("ot") !== -1 || goalAlignment.indexOf("nsure") !== -1 ||
                          goalAlignment.indexOf("on't") !== -1 || goalAlignment.indexOf("ad") !== -1 ) {
                          x += 0;
                      }
                      else {
                          x += 1;
                      }
                  }
                  if (riskLevel < reverseRisk) {
                      x += 1;
                  }
                  if (correctTime !== null) {
                      if (correctTime.indexOf("yes") !== -1) {
                          x += 1;
                      }
                  }
                  if (pastExperience.indexOf("ositive")!==-1) {
                      x += 1;
                  }
                  if (determineFun.indexOf("es") !== -1 || determineFun.indexOf("eah") !== -1) {
                      x += 1;
                  }
              }

                  //********************

// ----DAYS WEEKS

              else if ((timeString.indexOf("day") !== -1) || (timeString.indexOf("wk") !== -1)){
                  console.log('day');
                  console.log(`comitmentlevel: ${commitmentLevel}`)
                  if (commitmentLevel >= 7){
                      x+=1;
                      console.log('commitment greater than 7');
                  }
                  console.log(`phys feeling: ${physicalFeeling}`)
                  if (physicalFeeling !== null){
                      x+=0;
                  }
                  console.log(`goalAlign: ${goalAlignment}`)
                  if (goalAlignment !== null){
                      if (goalAlignment.indexOf("ot") !== -1 || goalAlignment.indexOf("nsure") !== -1 ||
                          goalAlignment.indexOf("on't") !== -1 || goalAlignment.indexOf("ad") !== -1 ){
                          x+=0;
                      }
                      else{
                          x+=1;
                      }
                  }
                  console.log(`risk level: ${riskLevel}`)
                  console.log(`reverse risk: ${reverseRisk}`)
                  if (riskLevel < reverseRisk){
                      x+=1;
                  }
                  console.log(`correct Time: ${correctTime}`)

                  if (correctTime.indexOf("es") !== -1  || correctTime.indexOf("eah") !== -1){
                          x+=1;
                  }
                  console.log(`pastExp: ${pastExperience}`)

                  if (pastExperience.indexOf("ositive")!==-1){
                      x+=1;
                  }
                  console.log(`determineFun: ${determineFun}`)
                  if (determineFun.indexOf("es") !== -1 || determineFun.indexOf("eah") !== -1){
                      x+=1;
                  }

                  console.log(`x: ${x}`)
              }

// ----MONTHS YEARS
              else if ((timeString.indexOf("mo") !== -1) || (timeString.indexOf("yr") !== -1)) {
                  x += 1;
                  if (commitmentLevel >= 6) {
                      x += 1;
                  }
                  if (physicalFeeling !== null) {
                      x += 0;
                  }
                  if (goalAlignment !== null) {
                      if (goalAlignment.indexOf("ot") !== -1 || goalAlignment.indexOf("nsure") !== -1 ||
                          goalAlignment.indexOf("on't") !== -1 || goalAlignment.indexOf("ad") !== -1 ) {
                          x += 0;
                      }
                      else {
                          x += 1;
                      }
                  }
                  if (riskLevel < reverseRisk) {
                      x += 1;
                  }
                  if (correctTime.indexOf("es") !== -1  || correctTime.indexOf("eah") !== -1) {
                      x += 1;
                  }

                  if (pastExperience.indexOf("ositive") !== -1 ) {
                      x += 1;
                  }
                  if (determineFun.indexOf("es") !== -1 || determineFun.indexOf("eah") !== -1)  {
                      x += 1;
                  }
              }


              else {
                  response += 'Alright ' + name + ', you received a score of ' + x + ' out of 8. You should think about it more. ';

              }

              if (x >= 7){
                  response+= 'Hello ' + name + ', you received a score of ' + x + ' out of 8. Sounds like a great idea to me. My help is just ' +
                      'suggested advice and should be used with common sense. ';
              }
              else if (x < 7 && x >=5){
                  response+= 'Hey ' + name + ', you received a score of ' + x + ' out of 8. Sounds like you are on the right track. ' +
                      'Get some advice from a real humanoid. My help is just ' + 'suggested advice and should be used with common sense. ';
              }
              else if (x < 5 && x >=3){
                  response+= 'Hi ' + name + ', you received a score of ' + x + ' out of 8. Sounds like an idea that needs some work, ' +
                      'but has potential. My help is just ' + 'suggested advice and should be used with common sense. ';
              }
              else {
                  response+= 'Alright ' + name + ', you received a score of ' + x + ' out of 8. This might not be the best decision for you. ' +
                      'Take some more time to think about it. My help is just suggested advice and should be used with common sense. ';
              }




//*********************


              app.tell(response);
          })
          .catch(err => {
              app.tell('There is an error.');
              console.error('ERROR:', err);
          });



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
