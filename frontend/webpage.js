// Where you want to render the map.
var element = document.getElementById('map');

// Create Leaflet map on map element.
var map = L.map(element);

// Add OSM tile layer to the Leaflet map.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Target's GPS coordinates.
var target = L.latLng('9.50737', '19.04611');

// Set map's center to target with zoom 14.
map.setView(target, 14);

// Place a marker on the same location.
L.marker(target).addTo(map);

function setMapTarget(newLat, newLong) {
    target = L.latLng(newLat, newLong);
}

async function routeData () {
    // Fetch and store data
    let id = document.getElementById('idDb').value;
    const res = await fetch("http://localhost:4000/data/?idDB=" + id);
    let data = await res.json();    
    localStorage.setItem("dataJson", JSON.stringify(data));
    window.location.reload();

};

window.onload = function() {
    // Populate data store to textboxes
    document.getElementById('statname_01').innerText = "Date de l’accident";
    document.getElementById('statname_02').innerText = "Borne kilométrique";
    document.getElementById('statname_03').innerText = "Localisation longitudinale";
    document.getElementById('statname_04').innerText = "Code du point cardinal";
    document.getElementById('statname_05').innerText = "Aspect de la route";
    document.getElementById('statname_06').innerText = "Accident en 2017 impliquant un arbre";
    document.getElementById('statname_07').innerText = "Accident en 2019 dans une zone de 40km avec la condition meteo (11-Clair)";
    document.getElementById('statname_08').innerText = "Accident en 2016 impliquant un véhicule d'urgence sur une route categorie (14-rue résidentielle)";
    document.getElementById('statname_09').innerText = "Accident en 2014 le lundi";
    document.getElementById('statname_10').innerText = "Accident en 2013 le vendredi";

 
    let data = JSON.parse(localStorage.getItem('dataJson'));

    document.getElementById('statdata_01').innerText = data.date;
    document.getElementById('statdata_02').innerText = data.borne;
    document.getElementById('statdata_03').innerText = data.locln; 
    document.getElementById('statdata_04').innerText = data.cdrnl;
    document.getElementById('statdata_05').innerText = data.aspct; 
    document.getElementById('statdata_06').innerText = data.aggr1[0].totalCount;
    document.getElementById('statdata_07').innerText = data.aggr2[0].totalCount;
    document.getElementById('statdata_08').innerText = data.aggr3[0].totalCount; 
    document.getElementById('statdata_09').innerText = data.aggr4[0].accidentLundi2014;
    document.getElementById('statdata_10').innerText = data.aggr5[0].totalCount; 

};