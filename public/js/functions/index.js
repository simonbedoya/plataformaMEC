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


function delete_netowrk() {
    swal({
        title: "Estás seguro?",
        text: "Desea eliminar esta red, si se elimina sera imposible recuperar los datos!",
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