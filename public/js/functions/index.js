/**
 * Created by sbv23 on 11/12/2016.
 */
var map;
var locationn = {lat: 3.8994815, lng: -72.7441639};

function initMap() {
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: locationn,
        zoom: 6
    });
}

function getLocations(email) {
   var image = "img/sensor.png";
    var marker;
   $.ajax({
        type: "post",
        url: "http://localhost:3000/data/location",
        data: {email: email},
        success: function (result) {
            //alert(result.msg);
            if (result.code == "001"){
                for(var i = 0; i < result.data.length; i++){
                    var lat = parseFloat(result.data[i].LAT_LOCATION);
                    var lng = parseFloat(result.data[i].LNG_LOCATION);
                    var locationSensor = {lat: lat, lng: lng};
                    marker = new google.maps.Marker({
                       position: locationSensor,
                       icon: image,
                       title: result.data[i].NAME_SENSOR + ", " + result.data[i].NAME_NETWORK + ", " + result.data[i].ADDRESS_NETWORK
                    });
                    marker.setMap(map);
                    google.maps.event.addListener(marker,'click',(function (marker, i) {
                        return function () {
                            loadGraphicSensor(result.data[i].SERIAL_SENSOR);
                        }
                    })(marker,i));
                }
                //alert(result.data[0]);

            }else if(result.code == "002"){
                //alert("not registered");
            }
        },
        error: function (e) {
            //document.getElementById('spinnerLogin').classList.add("hidden");
            alert("Error en el servidor");
        }
    });
}


function loadGraphicSensor(serial) {
    //alert(serial);
    document.location = "/graphic?id="+serial
}