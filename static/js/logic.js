var myMap = L.map("map", {
  center: [24, -17.5],
  zoom: 2
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

function getColor(d) {
  return d >= 7 ? '#b10026' :
         d >= 6 ? '#e31a1c' :
         d >= 5 ? '#fc4e2a' :
         d >= 4 ? '#fd8d3c' :
         d >= 3 ? '#feb24c' :
         d >= 2 ? '#fed976' :
         d >= 1 ? '#ffeda0' :
                  '#ffffcc';
}
var magnitudes = []
d3.json(earthquakeData, function(response) {

  // console.log(response);

  response.features.forEach(quake => {
    var properties = quake.properties
    // console.log(properties)
    var magnitude = properties.mag
    magnitudes.push(magnitude)
    var place = properties.place
    var time = properties.time
    // console.log(place)

    var geometry = quake.geometry
    // console.log(geometry)
    var coords = geometry.coordinates
    var lon = coords[0]
    var lat = coords[1]
    // console.log(lat, lon)

    var currentCircle = L.circle([lat, lon], {
      color: getColor(magnitude),
      opacity: .66,
      fillColor: getColor(magnitude),
      fillOpacity: .5,
      radius: magnitude * 50000,
    }).addTo(myMap)

    currentCircle.bindPopup("<strong>Magnitude: </strong>" + magnitude + "<br> <strong>Place: </strong>" + place + "<br> <strong>Time: </strong>" + Date(time))
  });
  


  var legend = L.control({position: 'topright'});

  legend.onAdd = function (myMap) {

      var div = L.DomUtil.create('div', 'info legend'),
          bins = [0, 1, 2, 3, 4, 5, 6, 7],
          labels = [];

      div.innerHTML = "<h4>Magnitude</h4>";

      // loop through our magnitude bins and generate a label with a colored square for each interval
      for (var i = 0; i < bins.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(bins[i]) + '"></i> ' +
              bins[i] + (bins[i + 1] ? '&ndash;' + bins[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap);

});
