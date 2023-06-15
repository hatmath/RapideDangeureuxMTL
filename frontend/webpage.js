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

// document.addEventListener('load', function() {
//     // Fetch data and populate textboxes
//     fetch('/data')
//       // .then(response => response.json())
//       .then(data => {
//         document.getElementById('statdata_01').value = data.date;
//         document.getElementById('statdata_02').value = data.borne;
//         document.getElementById('statdata_03').value = data.locln;
//         console.log("is happening")
        
//       })
//       .catch(err => {
//         console.log('Error:', err);
//       });
//   });

async function routeData () {
    // Fetch data and populate textboxes
    let id = document.getElementById('idDb').value;
    const res = await fetch("http://localhost:4000/data/?idDB=" + id);
    var data = await res.json();
    console.log(data);
    console.log(data.aspct);
    
    window.location.reload()
    
    document.getElementById('statdata_01').value = "test";
    document.getElementById('statdata_02').value = data.borne;
    document.getElementById('statdata_03').value = data.cdrnl;
    document.getElementById('statdata_04').value = data.date;
    document.getElementById('statdata_05').value = data.locln;

    




  };