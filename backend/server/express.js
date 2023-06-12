// ---------------------- 
// Réponse au cas 2 du tp avec apiInfo() et dataFetch 
//    Partiel seulement car traite pas le cas CSV
// Réponse au cas 3 avec setInterval
// ----------------------

//Constants
const app = require('express')();
const mongoose = require("mongoose");
const axios = require('axios')
const { Schema } = require("mongoose");
const port = 4000;
const targetApi = 'https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f';
const targetApiRoot = 'https://donnees.montreal.ca';

//Variables
let lastDataUpdate = -1;
let blockSize = 100;
let dataFetched = 0;
let databaseSize = 0;
let dbSchema = null;
let serviceRunning = false;
let apiStart = "";
let apiNext = "/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f&limit=0"; //initialiser pour la toute première requête
let dataLimit = 100;
// dataLimit = 10
let dataLimitTotal = 1000;
// dataLimitTotal = 10;
let timeoutDelay = 86400000; // 24h en milli
//timeoutDelay = 10000;

//Connection to database
mongoose.connect('mongodb://127.0.0.1:27017/RDmtlData');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully, to Fetch API data");
    //serviceRunning = true;
    apiInfo(); //On succesful connection, get info from API.
    });

//Express port listen
app.listen(
    port, 
    ()=> console.log(`Live on port ${port}`)
);

//FUNCTIONS
async function getMtlData() {

    let response = await fetch("https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f&limit=10");
    let mtlDataRawJson = await response.json()
    
    .then((accidents) => {
            for(var accident of accidents.result.records) {
                
                console.log(accident);
                db.collection("dataVDM").insertOne(accident, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    //db.close();
                  });
            }})
}


async function apiInfo() {
  
  try {
    const response = await axios.get(targetApiRoot + apiNext); // &limit=0 juste pour savoir le nombre d'objets json total
    databaseSize = response.data.result.total;    
    apiStart = response.data.result._links.start;
    apiNext = response.data.result._links.next;
    console.log(databaseSize);
    console.log(apiStart);
    console.log(apiNext);
    console.log(response.data.result._links);   
    apiNext = "/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f&limit=" + dataLimit //set apiNext à 1000 avant d'apppeler récursivement dataFetch
    db.dropDatabase("RDmtlData");
    // dataLimitTotal = databaseSize; // si on veux tout les objets de l'API soit plus de 218,000
    dataFetch();
  } catch (error) {
    console.error(error); 
  }

}


function dataFetch() {
  
  console.log("start fetching api data");
  console.log("url:" + targetApiRoot + apiNext);

  axios.get(targetApiRoot + apiNext)
    .then(function (response) {
      // handle success
      console.log("axios.then");
      lastDataUpdate = Date.now();

      for(var accident of response.data.result.records) {
                
        console.log(accident);

        db.collection("dataVDM").insertOne(accident, function(err, res) {
            if (err) throw err;
            dataFetched += 1;
            console.log("dataFetched: " + dataFetched);
            //db.close();
          });

      }
      
      if (dataFetched < dataLimitTotal) { // to do: 1500 n'a pas lieu d'etre seulement la pcq ca plante autrement debugger on veux que tant que dataFetched < que databaseSize on continue
        apiNext = response.data.result._links.next; 
        console.log("Next: " + apiNext);
        dataFetch(); 
      }
      
    })
    .catch(function (error) {
      // handle error
      console.log("error");
      console.log(error);
    })
    .finally(function () {
      // always executed
      console.log("finally");
      lastDataUpdate = Date.now(); // millisecondes depuis 1970
    }); 

}

function reloadData(){
  apiInfo();
  console.log("En attente pendant " + timeoutDelay); // to do: format en minutes 
}

setInterval(reloadData,timeoutDelay); 
