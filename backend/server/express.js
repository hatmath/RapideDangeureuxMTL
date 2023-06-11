//Constants
const app = require('express')();
const mongoose = require("mongoose");
const axios = require('axios')
const { Schema } = require("mongoose");
const port = 4000;
const targetApi = 'https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f';
const targetApiRoot = 'https://donnees.montreal.ca/';

//Variables
let lastDataUpdate = -1;
let blockSize = 100;
let dataFetched = 0;
let databaseSize = 0;
let dbSchema = null;
let serviceRunning = false;

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
                
                //console.log(accident);
                db.collection("dataVDM").insertOne(accident, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    //db.close();
                  });
            }})
}

async function apiInfo() {
  try {
    const response = await axios.get(targetApi);
    databaseSize = response.data.result.total;
    console.log(databaseSize);
    console.log(response.data.result._links);
    //dataFetch();
  } catch (error) {
    console.error(error);
  }
}

function dataFetch() {

  console.log("start fetching api data")

  axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

}
