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