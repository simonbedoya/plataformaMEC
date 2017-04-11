/**
 * Created by sbv23 on 11/12/2016.
 */
let map;
const locationn = {lat: 3.8994815, lng: -72.7441639};

function initMap() {
    let mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: locationn,
        zoom: 6
    });
}

function getLocations(email) {
   let image = "img/sensor.png";
   let marker;
   $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/location",
        data: {email: email},
        success: function (result) {
            if (result.code === "001"){
                for(let i = 0; i < result.data.length; i++){
                    let lat = parseFloat(result.data[i].LAT_LOCATION);
                    let lng = parseFloat(result.data[i].LNG_LOCATION);
                    let locationSensor = {lat: lat, lng: lng};
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
            }else if(result.code === "002"){
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    getLocations(email);
                });
            }
        },
        error: function (e) {
            console.log(e);
            swal({
                title: "Información",
                text: "Ha ocurrido un error intenta de nuevo!",
                type: "info",
                showCancelButton: false,
                confirmButtonColor: "#444a53",
                confirmButtonText: "OK"
            }).then(function () {

            });
        }
    });
}

function loadGraphicSensor(serial) {
    document.location = "/graphic?id="+serial
}

function reloadMap(email) {
    initMap();

    getLocations(email);
}