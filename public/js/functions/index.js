/**
 * Created by sbv23 on 11/12/2016.
 */
var map;
var locationn = {lat: 2.4503137, lng: -76.6164085};

function initMap() {
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: locationn,
        zoom: 15
    });
}


