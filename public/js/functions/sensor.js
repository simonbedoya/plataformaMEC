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


function loadData(email) {
    loadDataNetworks(email);
    loadDataSensors(email);
}

function loadDataNetworks(email) {
    $.ajax({
        type: "post",
        url: "http://52.34.55.59:3000/data/networks",
        data: {email: email},
        success: function (result) {
            //alert(result.msg);
            if (result.code == "001"){
                loadSelectorNetwork(result.data);
            }else if(result.code == "002"){
                //alert("no llego info");

            }
        },
        error: function (e) {
            //document.getElementById('spinnerLogin').classList.add("hidden");
            alert("Error en el servidor");
        }
    });
}

function loadDataSensors(email) {
    $.ajax({
        type: "post",
        url: "http://52.34.55.59:3000/data/sensors",
        data: {email: email},
        success: function (result) {
            //alert(result.msg);
            if (result.code == "001"){
                loadListSensors(result.data);
            }else if(result.code == "002"){
                //alert("no llego info");

            }
        },
        error: function (e) {
            //document.getElementById('spinnerLogin').classList.add("hidden");
            alert("Error en el servidor");
        }
    });
}

function loadListSensors(data) {

    for(var i=0; i < data.length; i++){

        var date = data[i].REGISTERDATE_SENSOR.toString();
        var dateArrayC = date.split("T");

        $('#table_sensors > tbody').append("<tr><td>"+data[i].SERIAL_SENSOR+"</td>"+
            "<td>"+data[i].NAME_SENSOR+"</td>"+
            "<td>"+data[i].STATUS_SENSOR+"</td>"+
            "<td>"+data[i].NAME_NETWORK+"</td>"+
            "<td>"+dateArrayC[0]+"</td>"+
            "<td class='actions'>"+
                "<a onclick='showInfo_sensor()' class='' style='color: #0101DF; margin-right: 10px;'><i class='zmdi zmdi-loupe'></i></a>"+
                "<a onclick='showLocation_sensor()' class='' style='color: #424242; margin-right: 10px;'><i class='ion-ios7-location'></i></a>"+
                "<a href='/graphic?id=WEDRFEDDR' class='' style='color: #0B610B; margin-right: 10px;'><i class='fa fa-pie-chart'></i></a>"+
                "<a onclick='showEdit_sensor()' class='' style='color: #DBA901; margin-right: 10px;'><i class='fa fa-pencil'></i></a>"+
                "<a onclick='showConfig_sensor()' class='' style='color: #DF7401; margin-right: 10px;'><i class='fa fa-wrench'></i></a>"+
                "<a onclick='delete_sensor()' class='' style='color: #B40404'><i class='fa fa-trash-o'></i></a>"+
            "</td></tr>");
    }
    loadDataTable();
}

function loadSelectorNetwork(data) {
    for(var i=0; i < data.length; i++){
        $('#edit_status_netowrk').append("<option value='"+data[i].PK_NETWORK+"'>"+data[i].NAME_NETWORK+"</option>");
    }
}

function loadDataTable() {
    $(document).ready(function() {
        $('#datatable').dataTable();
        $('#datatable-keytable').DataTable( { keys: true } );
        $('#datatable-responsive').DataTable();
        $('#datatable-scroller').DataTable( { ajax: "assets/datatables/json/scroller-demo.json", deferRender: true, scrollY: 380, scrollCollapse: true, scroller: true } );
        var table = $('#datatable-fixed-header').DataTable( { fixedHeader: true } );
    } );
    TableManageButtons.init();
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