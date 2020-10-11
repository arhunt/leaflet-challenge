// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Dark layer
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

// Create the map with our layers
var map = L.map("map", {
    center: [39, -105],
    zoom: 5,
    // Specify the default layers
    layers: [darkmap]
  });

lightmap.addTo(map);

var baseMaps = {
    Light: lightmap,
    Dark: darkmap
  };

L.control.layers(baseMaps).addTo(map);

// //Testing adding a marker
// var marker = L.marker([45.52, -122.67], {
//     draggable: true,
//     title: "My First Marker",
//   }).addTo(map);
  
//   // Binding a pop-up to our marker
// marker.bindPopup("Hello There!");

// HOW TO MAKE A FUNCTION BASED ON THE DATA
// // Define a markerSize function that will give each city a different radius based on its population
// function markerSize(population) {
//     return population / 40;
//   }
// L.circle(cities[i].location, { radius: markerSize(cities[i].population) }
//
// OR WITHOUT A FUNCTION:
//
// radius: countries[i].points * 1500


