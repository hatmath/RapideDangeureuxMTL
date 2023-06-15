// Projet: Rapide & Dangereux (Édition ville de Montréal)
// Codeurs: Joseph, Isabelle, Mathieu
// Cours : Programmation Web côté serveur (420-289-AH)

//Constants
const app = require('express')();
const mongoose = require("mongoose");
const axios = require('axios');
const csv=require('csvtojson');
const cors = require('cors');
const port = 4000;
const targetApiRoot = 'https://donnees.montreal.ca';
const csvFilePath='cacheData/collisions_routieres.csv'; 
const dbAdress = "mongodb://127.0.0.1:27017/RDmtlData";

//Variables
let lastDataUpdate = -1;
let dataFetched = 0;
let databaseSize = 0;
let apiNext = ""; 
let dataLimit = 31000;
let timeoutDelay = 86400000; 
let apiNotReachable = false; // ignorer API
let loadCSVOnce = false;
let loadCSVEachTime = true;
let csvLoadCount = 0;
let printToConsole = false; // to do: remettre à true car répond au cas 1 du tp

//Connection to database
mongoose.connect(dbAdress);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully, to Fetch API data");
    // apiInfo();
    });

app.use(cors());

//Express port listen
app.listen(
    port, 
    ()=> console.log(`Express server live on port ${port}`)
);

//FUNCTIONS
async function apiInfo() {
  
  try {
    
    db.dropDatabase("RDmtlData");

    apiNext = "/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f&limit=0";
    const response = await axios.get(targetApiRoot + apiNext)
      .catch(function (error) {
        console.log("Erreur durant la tentative de connection à l'API : " + error)  
        apiNotReachable = true;
      });  

    if (!apiNotReachable) { // API
      databaseSize = response.data.result.total;
      console.log("L'API contient " + databaseSize + " objets");
      apiNext = "/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f&limit=" + dataLimit;      
      dataFetch();

    } else if (!loadCSVOnce) { 
      console.log("Chargement des données CSV pour la première fois");
      loadCSV();
      loadCSVOnce = true;
      csvLoadCount++;
  
    } else if (loadCSVEachTime) {
      console.log("Chargement des données CSV pour la " + csvLoadCount + "ième fois");
      csvLoadCount++;
      loadCSV();
    }

  } catch (error) {  
    
    console.log("Erreur dans apiInfo()");
    console.error(error);

  }
}

function dataFetch() {
  
  console.log("Télécharger les données de l'API (" + dataLimit + "/fois)");

  axios.get(targetApiRoot + apiNext)
    .then(function (response) {
     
      db.collection("dataVDM").insertMany(response.data.result.records); 
      dataFetched += dataLimit; 

      if (printToConsole) {
        console.log("API - Lien: " + targetApiRoot + apiNext);
        console.log("API - Nombre d'objets total (véridique): " + databaseSize);
        console.log("API - Nombre d'objets déjà récupérés: " + dataFetched);
        console.log("API - Nombre d'objets récupérés par requête: " + dataLimit);
        console.log("Contenu du fetch API en cours: "); 
        console.log(response.data.result.records);
      }            
      
      if (dataFetched < databaseSize) {
        apiNext = response.data.result._links.next; 
        dataFetch(); 
      } else {
        console.log("Fini de charger les " + databaseSize + " objets de l'API");
        console.log("Serveur en attente pour 24h...");
      }
      
    })
    .catch(function (error) {
      lastDataUpdate = -1;
      console.log("Erreur de lecture/chargement via l'API ou d'ajout dans la DB");
      console.error("Détail de l'erreur: " + error); 
    })
    .finally(function () {
      lastDataUpdate = Date.now();
      loadDataSucess = true      
    }); 

}

async function loadCSV() {

  try {

    let  jsonArray;
    
    csv()
      .fromFile(csvFilePath)
      .then((jsonObj)=>{
        jsonArray = jsonObj;
        db.collection("dataVDM").insertMany(jsonArray);
      })
      .finally(function () {
        loadDataSucess = true
        lastDataUpdate = Date.now();

        if (printToConsole) { 
          console.log("Contenu du fichier CSV: ");
          console.log(jsonArray);
        }

        console.log("Fini de charger les " + jsonArray.length + " objets du CSV");
        console.log("Serveur en attente pour 24h...");

      });     
       
  } catch (error) {  

    lastDataUpdate = -1
    console.log("Erreur de lecture/chargement du fichier CSV ou d'ajout dans la DB");
    console.error("Détail de l'erreur: " + error); 

  }
  
}


// Define the route  
app.get('/data', async (req, res) => {

  // to do: Pour une BD, CSV trouver une manière de bâtir une requête qui fonctionne 
  // idObject = {"NO_SEQ_COLL": "SPVM _ 2012 _ 1"};

  let selectedId = req.query.idDB;
  let idObject = {};
  idObject["_id"] = parseInt(selectedId);
  let selectedData = await db.collection("dataVDM")
                             .findOne(idObject);

//Aggr1 = accident en 2017 impliquant un arbre.
  let aggr1 = await db.collection("dataVDM").aggregate([
    { $match: { $and: [{CD_GENRE_ACCDN: 43}, {AN: 2017}]}},
    { $count: 'totalCount' }
    ])
    .toArray((err, result) => {
      if (err) {
        console.error('Erreur: ', err);
        return;
      }
    });
//Aggr2 = accident en 2019 dans une zone de 40 avec la condition meteo (11)
    let aggr2 = await db.collection("dataVDM").aggregate([
      { $match: { $and: [{VITESSE_AUTOR: 40}, {CD_COND_METEO: 11}, {AN: 2019}]}},
      { $count: 'totalCount' }
      ])
      .toArray((err, result) => {
        if (err) {
          console.error('Erreur: ', err);
          return;
        }
      });
//Aggr3 = accident en 2016 impliquant un vehicule d'urgence sur une route categorie (14)
let aggr3 = await db.collection("dataVDM").aggregate([
  { $match: { $and: [{nb_urgence: 1}, {CD_CATEG_ROUTE: 14}, {AN: 2016}]}},
  { $count: 'totalCount' }
  ])
  .toArray((err, result) => {
    if (err) {
      console.error('Erreur: ', err);
      return;
    }
  });
//Aggr4 = accident en 2014 le lundi
let aggr4 = await db.collection("dataVDM").aggregate([
  { $match: { $and: [{JR_SEMN_ACCDN: "LU"}, {AN: 2014}]}},
  { $count: 'accidentLundi2014' }
  ])
  .toArray((err, result) => {
    if (err) {
      console.error('Erreur: ', err);
      return;
    }
  });
  //Aggr5 = accident en 2013 le vendredi
  let aggr5 = await db.collection("dataVDM").aggregate([
    { $match: { $and: [{JR_SEMN_ACCDN: "VE"}, {AN: 2013}]}},
    { $count: 'totalCount' }
    ])
    .toArray((err, result) => {
      if (err) {
        console.error('Erreur: ', err);
        return;
      }
    });

  let outputData = {
  "date" : selectedData["DT_ACCDN"],
  "borne" : selectedData["BORNE_KM_ACCDN"],
  "locln" : selectedData["CD_LOCLN_ACCDN"],
  "cdrnl" : selectedData["CD_PNT_CDRNL_REPRR"],
  "aspct" : selectedData["CD_ASPCT_ROUTE"],
  "accLong" : selectedData["LOC_LONG"],
  "accLat" : selectedData["LOC_LAT"],
  "aggr1" : aggr1,
  "aggr2" : aggr2,
  "aggr3" : aggr3,
  "aggr4" : aggr4,
  "aggr5" : aggr5
  } 
  
  res.send(outputData);

});


function reloadData(){
  apiInfo();  
}

setInterval(reloadData,timeoutDelay);

