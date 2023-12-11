// add a tile layer to our map
var url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  attr =
    '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  osm = L.tileLayer(url, {
    maxZoom: 18,
    attribution: attr,
  });

// initialize the map
var map = L.map('map').setView([35.7266253, 51.3739067], 15).addLayer(osm);

// click event
map.on('click', onMapClick);

var markers = [];

// Script for adding marker on map click
function onMapClick(e) {
  $('#latitude').val(e.latlng.lat);
  $('#longitude').val(e.latlng.lng);
  var geojsonFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [e.latlng.lat, e.latlng.lng],
    },
  };
  if (markers.length > 0) {
    map.removeLayer(markers.pop());
  }
  var marker;

  L.geoJson(geojsonFeature, {
    pointToLayer: function (feature, latlng) {
      marker = L.marker(e.latlng, {
        title: 'Resource Location',
        alt: 'Resource Location',
        riseOnHover: true,
        draggable: true,
      });
      markers.push(marker);

      return marker;
    },
  }).addTo(map);
}
