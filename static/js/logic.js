

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }


function createMap(earthquakes){
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

    var baseMaps = {
        Light: lightmap,
        Dark: darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create the map with our layers
    var map = L.map("map", {
        center: [39, -105],
        zoom: 5,
        // Specify the default layers
        layers: [darkmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps).addTo(map);
}


// for content layers see activity 1.08



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

// Color choice see World Cup data 1.07
