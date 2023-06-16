// Projet: Rapide & Dangereux (Édition ville de Montréal)
// Codeurs: Joseph, Isabelle, Mathieu
// Cours : Programmation Web côté serveur (420-289-AH)

window.onload = async function() {

    const res = await fetch("http://localhost:4000/data");
    let data = await res.json();    
    console.log(data);

    // Populate data store to textboxes
    document.getElementById('statname_01').innerText = "Date de l’accident";
    document.getElementById('statname_02').innerText = "Nombre de véhicules impliqués";
    document.getElementById('statname_03').innerText = "Localisation longitudinale";
    document.getElementById('statname_04').innerText = "Code du point cardinal";
    document.getElementById('statname_05').innerText = "Aspect de la route";
    document.getElementById('statname_06').innerText = "Accidents en 2017 impliquant un arbre";
    document.getElementById('statname_07').innerText = "Accidents en 2019 dans une zone de 40km avec la condition meteo (11-Clair)";
    document.getElementById('statname_08').innerText = "Accidents en 2016 impliquant un véhicule d'urgence sur une route categorie (14-rue résidentielle)";
    document.getElementById('statname_09').innerText = "Accidents en 2014 le lundi";
    document.getElementById('statname_10').innerText = "Accidents en 2013 le vendredi";

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

    //Map
    document.getElementById('lblMap').innerText = "Un accident, est survenu le " + data.date.substring(0,10) + " à cet endroit:";
    var element = document.getElementById('map');
    var map = L.map(element);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    var target = L.latLng(data.accLat, data.accLong);

    map.setView(target, 17);
    L.marker(target).addTo(map);
};