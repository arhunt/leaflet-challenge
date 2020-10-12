// Location of chosen JSON
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Query the JSON, Use response to create features
d3.json(queryURL, function(data) { createFeatures(data.features); });

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
            return "mediumaquamarine"
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

    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

    var plates = new L.LayerGroup();

    d3.json(platesURL, function(data) {
        L.geoJSON(data, {
            style: function() {
                return {color: "purple", weight: 2}
            }
        }).addTo(plates)
        })

    var baseMaps = {
        Light: lightmap,
        Dark: darkmap,
        Satellite: satellitemap
    };

    var overlayMaps = {
        "Tectonic Plates": plates,
        "Earthquakes": earthquakes,
    };

    // Map with coords, zoom, layers
    var map = L.map("map", {
        center: [39, -105],
        zoom: 5,
        // Default layers
        layers: [darkmap, earthquakes, plates]
    });

    L.control.layers(baseMaps, overlayMaps).addTo(map);

    // Legend - code from https://leafletjs.com/examples/choropleth/
    var legend = L.control({position: "bottomright"});
    
    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [],
        labels = [];

        div.innerHTML += "<h4>Depth (km)</h4>";
        div.innerHTML += '<i style = "background: mediumaquamarine"></i> up to 10<br>';
        div.innerHTML += '<i style = "background: yellowgreen"></i> 10 to 30<br>';
        div.innerHTML += '<i style = "background: gold"></i> 30 to 50<br>';
        div.innerHTML += '<i style = "background: darkorange"></i> 50 to 70<br>';
        div.innerHTML += '<i style = "background: orangered"></i> 70 to 90<br>';
        div.innerHTML += '<i style = "background: red"></i> 90+<br>';

        return div;
    };
    // Add the info legend to the map
    legend.addTo(map);
}

