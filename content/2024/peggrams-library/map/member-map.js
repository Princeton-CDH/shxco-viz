// mapbox token restricted to this glitch url
var mapboxToken =
  "pk.eyJ1Ijoicmxza29lc2VyIiwiYSI6ImNrdm1wZjFqczBkNTgydnFzZjc3M2h3bTcifQ.HP0eRdYW3HSrzMbTZ_RzYQ";
var mapboxBasemap = "light-v10";
var parisOverlay =
  "https://tiles.arcgis.com/tiles/4Ko8f1mCWFLyY4NV/arcgis/rest/services/Paris_1943/MapServer";

var __spreadArray =
  (this && this.__spreadArray) ||
  function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };

var leaflet_1 = L; // leafleft
var esri_leaflet_1 = L.esri; // require("esri-leaflet");
//var addressDataElement = document.getElementById('address-data');
//var addressData = JSON.parse(addressDataElement.textContent || '');

// S&co library address is defined in index.html
var libraryAddressDataElement = document.getElementById("library-address");
var libraryAddress = JSON.parse(libraryAddressDataElement.textContent || "");
/*
 * map object with custom zoom control in bottom right
 */
var target = document.getElementById("address-map");
var addressMap = (0, leaflet_1.map)(target, {
  zoomControl: false,
  scrollWheelZoom: false
});
var zoomControl = leaflet_1.control.zoom({ position: "bottomright" });
zoomControl.addTo(addressMap);
/*
 * basic tiled basemap from mapbox
 */
var basemap = (0, leaflet_1.tileLayer)(
  "https://api.mapbox.com/styles/v1/mapbox/" +
    mapboxBasemap +
    "/tiles/{z}/{x}/{y}?access_token=" +
    mapboxToken,
  {
    attribution:
      'Tiles <a href="https://apps.mapbox.com/feedback/">Mapbox</a>, <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
);
basemap.addTo(addressMap);
/*
 * historic map of paris overlay
 */
var parisTiles = new esri_leaflet_1.TiledMapLayer({
  url: parisOverlay,
  attribution:
    '<a href="https://maps.princeton.edu/catalog/princeton-2r36tz994">Princeton University Library</a>'
});
parisTiles.addTo(addressMap);
/*
 * bookstore icon + marker on map
 */
var bookstoreMarker;
if (libraryAddress) {
  // only add if data is available
  var bookstoreIcon = (0, leaflet_1.icon)({
    iconUrl:
      "https://cdn.glitch.me/2fcc7439-ede7-4a6a-8c7a-03405ffd4b8c%2Fbookstore-pin.svg?v=1636144605038",
    iconSize: [46, 62],
    iconAnchor: [23, 62],
    popupAnchor: [0, -60]
  });
  bookstoreMarker = (0, leaflet_1.marker)(
    [libraryAddress.latitude, libraryAddress.longitude],
    {
      icon: bookstoreIcon,
      zIndexOffset: 1
    }
  );
  bookstoreMarker.bindPopup(popupText(libraryAddress));
  bookstoreMarker.addTo(addressMap);
}
/*
 * address icons + markers on map
 */
var addressIconInactive = (0, leaflet_1.icon)({
  iconUrl:
    "https://cdn.glitch.me/2fcc7439-ede7-4a6a-8c7a-03405ffd4b8c%2Finactive-pin.svg?v=1636144585892",
  iconSize: [46, 70],
  iconAnchor: [23, 70],
  popupAnchor: [0, -70]
});
var addressIconActive = (0, leaflet_1.icon)({
  iconUrl:
    "https://cdn.glitch.me/2fcc7439-ede7-4a6a-8c7a-03405ffd4b8c%2Fselected-pin.svg?v=1636144610551",
  iconSize: [46, 70],
  iconAnchor: [23, 70],
  popupAnchor: [0, -70]
});
// generate a paragraph of text from the parts of the address to go in popup

function popupText(_a) {
  var name = _a.name,
    street_address = _a.street_address,
    city = _a.city,
    arrondissement = _a.arrondissement;
  // var parts = [name, street_address, city + " " + arrondissement].filter(
  // omit city & arrondissement
  var parts = [name, street_address].filter(
    function(p) {
      return !!p;
    }
  );
  return "<p>" + parts.join("<br/>") + "</p>";
}
// handlers that switch the icon when popup is active
function onPopupOpen(event) {
  event.target.setIcon(addressIconActive);
}
function onPopupClose(event) {
  event.target.setIcon(addressIconInactive);
}

// load addresses to display from json file
fetch("addresses.json")
  .then(response => response.json())
  .then(data => {
    var addressData = data.addresses;

    // create the actual markers
    var addressMarkers = addressData.map(function(a) {
      // configure popups not to close
      var p = new leaflet_1.Popup({ autoClose: false, closeOnClick: false }).setContent(
        popupText(a)
      );
      return (0, leaflet_1.marker)([a.latitude, a.longitude], {
        icon: addressIconInactive
      }).bindPopup(p);
      // }).bindPopup(popupText(a));
    });
    // bind handlers and add to map
    addressMarkers
      .map(function(m) {
        return m.on("popupopen", onPopupOpen);
      })
      .map(function(m) {
        return m.on("popupclose", onPopupClose);
      })
      .map(function(m) {
        return m.addTo(addressMap);
      });
    /*
     * set up initial zoom/view
     */
    // zoom to fit all markers
    var allMarkers = (0, leaflet_1.featureGroup)(
      __spreadArray([], addressMarkers, true)
    );
    if (bookstoreMarker) allMarkers.addLayer(bookstoreMarker);
    addressMap.fitBounds(allMarkers.getBounds().pad(0.1));
    // open the first marker: needs a delay otherwise the text inside will be
    // truncated, leaflet bug?
    setTimeout(function() {
      // site functionality: display popup for the first address      
      // return addressMarkers[0].openPopup();

      // temporary: display popup for all addresses and bookstore
      addressMarkers.map(function(a) {
        // a.openPopup();
      });
      // bookstoreMarker.openPopup();
    }, 100);

  });
