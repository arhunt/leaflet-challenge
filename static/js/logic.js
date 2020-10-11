// Location of chosen JSON
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Query the JSON
d3.json(queryURL, function(data) {
    // Use response to create features
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Construct popups
    function onEachFeature(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.place + "</strong><br>" +
        new Date(feature.properties.time) +
        "<br><strong>Magnitude: </strong>" + feature.properties.mag +
        "<br><strong>Depth (km): </strong>" + feature.geometry.coordinates[2] );
    }
  
    // Determine color of circle
    function circleColor(depth) {
        if (depth < 10) {
            return "green"
        }
        else if (depth < 30) {
            return "yellowgreen"
        }
        else if (depth < 50) {
            return "yellow"
        }
        else if (depth < 70) {
            return "darkorange"
        }
        else if (depth < 90) {
            return "orangered"
        }
        else {return "red"}
    }

    // GeoJSON layer with circles
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(earthquakeData) {
            var latitude = earthquakeData.geometry.coordinates[1];
            var longitude = earthquakeData.geometry.coordinates[0];
            return L.circle([latitude, longitude],
                {
                    radius : earthquakeData.properties.mag * 10000,
                    color : circleColor(earthquakeData.geometry.coordinates[2]),
                    fillOpacity: 1,
                    stroke: false
                }
                );
        },
      onEachFeature: onEachFeature
    });
  
    // Create map with earthquakes layer
    createMap(earthquakes);
  }


function createMap(earthquakes){
    // Lightmap layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });

    // Darkmap layer
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

    // Map with coords, zoom, layers
    var map = L.map("map", {
        center: [39, -105],
        zoom: 5,
        // Default layers
        layers: [darkmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps).addTo(map);
}
