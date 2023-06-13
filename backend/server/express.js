
// Projet: Rapide & Dangereux (Édition ville de Montréal)
// Codeurs: Joseph, Isabelle, Mathieu
// Cours : Programmation Web côté serveur (420-289-AH)

//Constants
const app = require('express')();
const mongoose = require("mongoose");
const axios = require('axios');
const csv=require('csvtojson');
const { Schema } = require("mongoose");
const port = 4001;
const targetApi = 'https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f';
const targetApiRoot = 'https://donnees.montreal.ca';
const maxiCsvFilePath='cacheData/collisions_routieres.csv'; 
const miniCsvFilePath='cacheData/collisions_routieres_mini.csv';

//Variables
let lastDataUpdate = -1; // millisecondes depuis 1970
let blockSize = 100;
let dataFetched = 0;
let databaseSize = 0;
let dbSchema = null;
let serviceRunning = false;
let apiStart = "";
let apiNext = "/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f&limit=0"; //initialiser pour la toute première requête
let dataLimit = 100;
let dataLimitTotal = 1000;
let allAPI = true; // Indique que dataLimitTotal doit être tout les objets disponible de l'API (dataLimitTotal = databaseSize)

let timeoutDelay = 86400000; // 24h en milliseconde
// timeoutDelay = 10000;

// Mettre apiNotReachable à true manuellement pour simuler l'absence de connection internet. 
// L'autre manière est de se déconnecter physiquement. 
// Mais en production, on laisse à false et une mauvaise connection ce produit, dans la code la valeur sera mise à true et on prendra les données d'un fichier CSV prévu à cet effet
let apiNotReachable = false; 


let loadCSVOnce = false; // Si problème de connection à l'API et qu'on a pas charger le CSV (false) au moins une fois, le faire. Sinon true, et on ne recharge pas.
let loadCSVEachTime = true; // Chaque 24h si l'API n'est pas accessible décider si on charge le CSV (true) ou pas (false)
let csvLoadCount = 0;
let allCSV = true; // Charger tout le fichier CSV ou seulement un sous-ensemble de quelques objets

let printToConsole = true; // switch on-off pour imprimer les accidents et autre info à la console

let loadDataSucess = false; // présumer le pire scénario i.e. que le chargements de données posera problème pour xyz raisons. Mettre à true si tout ce deroule bien


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
    ()=> console.log(`Express server live on port ${port}`)
);


//FUNCTIONS
async function apiInfo() {
  
  try {
    
    db.dropDatabase("RDmtlData"); // On drop ici pour repartir à 0 chaque 24h (en prod). Donc, peut importe la manière de charger les données on part d'une bd vierge

    const response = await axios.get(targetApiRoot + apiNext)
      .catch(function (error) {
        console.log("Erreur durant la tentative de connection à l'API")  
        apiNotReachable = true;
      });  

    if (!apiNotReachable) { // API
      databaseSize = response.data.result.total;
      console.log("L'API contient " + databaseSize + " objets.");

      apiStart = response.data.result._links.start; // rm!
      apiNext = response.data.result._links.next;

      apiNext = "/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f&limit=" + dataLimit //set dataLimit avant d'apppeler récursivement dataFetch()

      if (allAPI) {
        dataLimitTotal = databaseSize; // si on veux tout les objets de l'API soit plus de 218,000
      }
      
      dataFetch();

    } else if (!loadCSVOnce) { // situation où l'API n'est pas accessible on doit charger le CSV au moins une fois
      console.log("Chargement des données CSV pour la première fois");
      loadCSV();
      loadCSVOnce = true;
      csvLoadCount++;
  
    } else if (loadCSVEachTime) { // switch on-off qui indique si on désire charger le fichier CSV chaque fois que l'API n'est pas accessible
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
  
  console.log("Start fetching API data");

  axios.get(targetApiRoot + apiNext)
    .then(function (response) {
     
      db.collection("dataVDM").insertMany(response.data.result.records); 
      dataFetched += dataLimit; //Should be retrieved from the API call...

      if (printToConsole) { 
        console.log("API - Lien: " + targetApiRoot + apiNext);
        console.log("API - Nombre d'objets total (véridique): " + databaseSize);
        console.log("API - Nombre d'objets total (choisi): " + dataLimitTotal); // Permet de ne pas tout charger les données
        console.log("API - Nombre d'objets déjà récupérés: " + dataFetched);
        console.log("API - Nombre d'objets récupérés par requête: " + dataLimit);
        console.log("Contenu du fetch API en cours: "); 
        console.log(response.data.result.records);
      }            
      
      if (dataFetched < dataLimitTotal) {
        apiNext = response.data.result._links.next; 
        dataFetch(); 
      }
      
    })
    .catch(function (error) {
      lastDataUpdate = -1 //Problème alors on ne peut considérer que l'update a bien eu lieu
      console.log("Erreur de lecture/chargement via l'API ou d'ajout dans la DB");
      console.error("Détail de l'erreur: " + error); 
    })
    .finally(function () {
      // always executed
      lastDataUpdate = Date.now();
      loadDataSucess = true
    }); 

}


// const { error } = require('console');

async function loadCSV() {

  try {

    let csvFilePath;
    if (allCSV) {
      csvFilePath = maxiCsvFilePath;
    } else {
      csvFilePath = miniCsvFilePath; 
    }

    let  jsonArray;
    
    csv()
      .fromFile(csvFilePath)
      .then((jsonObj)=>{
        jsonArray = jsonObj;
        db.collection("dataVDM").insertMany(jsonArray);
      })
      .finally(function () {
        // always executed
        loadDataSucess = true
        lastDataUpdate = Date.now();

        if (printToConsole) { 
          console.log("Contenu du fichier CSV: ");
          console.log(jsonArray);
        } 

      });     
       
  } catch (error) {  

    lastDataUpdate = -1 //Problème alors on ne peut considérer que l'update a bien eu lieu
    console.log("Erreur de lecture/chargement du fichier CSV ou d'ajout dans la DB");
    console.error("Détail de l'erreur: " + error); 

  }
  
}

function reloadData(){
  apiInfo();
  console.log("APRÈS le chargement des données le serveur se mettera en attente pour [ " + timeoutDelay + " ] millisecondes"); // to do: format en minutes
}

console.log("APRÈS le chargement des données le serveur se mettera en attente pour [ " + timeoutDelay + " ] millisecondes"); // to do: format en minutes
setInterval(reloadData,timeoutDelay);

// while (true) { 
  // if (loadDataSucess) {
  //   console.log("Serveur en attente pour [ " + timeoutDelay + " ] millisecondes"); // to do: format en minutes
  //   loadDataSucess = false;
  //   setInterval(reloadData,timeoutDelay);
  // }
// }

