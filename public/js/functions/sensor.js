/**
 * Created by sbv23 on 27/12/2016.
 */
var map;
var locationn = {lat: 2.4503137, lng: -76.6164085};
var dataNetworksSensor;
var pk_sensor = 0;

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
                loadListSensors(result.data, true);
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

function loadListSensors(data, load) {

    $('#table_sensors > tbody').empty();

    dataNetworksSensor = new Array();

    for(var i=0; i < data.length; i++){

        dataNetworksSensor[data[i].PK_SENSOR] = data[i];
        var date = data[i].REGISTERDATE_SENSOR.toString();
        var dateArrayC = date.split("T");

        $('#table_sensors > tbody').append("<tr><td>"+data[i].SERIAL_SENSOR+"</td>"+
            "<td>"+data[i].NAME_SENSOR+"</td>"+
            "<td>"+data[i].STATUS_SENSOR+"</td>"+
            "<td>"+data[i].NAME_NETWORK+"</td>"+
            "<td>"+dateArrayC[0]+"</td>"+
            "<td class='actions'>"+
                "<a onclick='showInfo_sensor("+data[i].PK_SENSOR+")' class='' style='color: #0101DF; margin-right: 10px;'><i class='zmdi zmdi-loupe'></i></a>"+
                "<a onclick='showLocation_sensor("+data[i].PK_SENSOR+")' class='' style='color: #424242; margin-right: 10px;'><i class='ion-ios7-location'></i></a>"+
                "<a href='/graphic?id="+data[i].SERIAL_SENSOR+"' class='' style='color: #0B610B; margin-right: 10px;'><i class='fa fa-pie-chart'></i></a>"+
                "<a onclick='showEdit_sensor("+data[i].PK_SENSOR+")' class='' style='color: #DBA901; margin-right: 10px;'><i class='fa fa-pencil'></i></a>"+
                "<a onclick='showConfig_sensor("+data[i].PK_SENSOR+")' class='' style='color: #DF7401; margin-right: 10px;'><i class='fa fa-wrench'></i></a>"+
                "<a onclick='delete_sensor("+data[i].PK_SENSOR+")' class='' style='color: #B40404'><i class='fa fa-trash-o'></i></a>"+
            "</td></tr>");
    }
    if(load) {
        loadDataTable();
    }
}

function loadSelectorNetwork(data) {
    for(var i=0; i < data.length; i++){
        $('#select_network').append("<option value='"+data[i].PK_NETWORK+"'>"+data[i].NAME_NETWORK+"</option>");
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

function filterSensorByNetwork() {
    //alert("change");
    var pk_network = $('#select_network').val();
    $.ajax({
        type: "post",
        url: "http://52.34.55.59:3000/data/sensorsByNetwork",
        data: {pk_network: pk_network},
        success: function (result) {
            //alert(result.msg);
            if (result.code == "001"){
                loadListSensors(result.data, false);
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

function showInfo_sensor(pk_sensor) {
    $("#info_sensor").modal();

}

function showLocation_sensor(pk_sensor) {
    $("#location_sensor").modal();
}

function showEdit_sensor(sensor) {
    $("#edit_sensor").modal();
    document.getElementById("edit_name_sensor").value = dataNetworksSensor[sensor].NAME_SENSOR;
    pk_sensor = sensor;
}

function showConfig_sensor(pk_sensor) {
    $("#config_sensor").modal();
}

function save_edit_sensor() {
    var name = document.getElementById("edit_name_sensor").value;
    if(name != dataNetworksSensor[pk_sensor].NAME_SENSOR){
        $.ajax({
            type: "post",
            url: "http://52.34.55.59:3000/data/updateNameSensor",
            data: {pk_sensor: pk_sensor, name: name},
            success: function (result) {
                //alert(result.msg);
                if (result.code == "001"){
                    document.location = "/sensor";
                }else if(result.code == "002"){
                    //alert("no llego info");

                }
            },
            error: function (e) {
                //document.getElementById('spinnerLogin').classList.add("hidden");
                alert("Error en el servidor");
            }
        });
    }else{
        $("#edit_sensor").modal('hide');
    }
}