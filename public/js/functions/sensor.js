/**
 * Created by sbv23 on 27/12/2016.
 */
var map;
var locationn = {lat: 2.4503137, lng: -76.6164085};


$("#location_sensor").on('shown.bs.modal', function () {
        initMap();
});

function initMap() {
    var mapDiv = document.getElementById('map_location_sensor');
    map = new google.maps.Map(mapDiv, {
        center: locationn,
        zoom: 15
    });
}

function delete_sensor() {
    swal({
        title: "Estás seguro?",
        text: "Desea eliminar esta sensor, si se elimina sera imposible recuperar los datos!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, Borrarlo!",
        cancelButtonText: "No, Cancelar!",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function(isConfirm){
        if (isConfirm) {
            swal("Eliminado!", "Se ha eliminado corectamente.", "success");
        } else {
            swal("Cancelado", "Se ha cancelado", "error");
        }
    });
}

function showInfo_sensor() {
    $("#info_sensor").modal();
}

function showLocation_sensor() {
    $("#location_sensor").modal();
}

function showEdit_sensor() {
    $("#edit_sensor").modal();
}

function showConfig_sensor() {
    $("#config_sensor").modal();
}