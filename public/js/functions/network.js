/**
 * Created by sbv23 on 27/12/2016.
 */
var dataNetworks = new Array();
var pk_user = 0;

function dele_network(network) {
    $.ajax({
        type: "post",
        url: "http://localhost:3000/data/delete_network",
        data: {network: network},
        success: function (result) {
            //alert(result.msg);
            if (result.code == "001"){
                swal({
                    title: "Alerta",
                    text: "Se ha eliminado satisfactoriamente la red!",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                }, function(){
                    document.location = "/network";
                });
            }else if(result.code == "002"){
                alert("no se elimino la red");
            }else{
                swal({
                    title: "Alerta",
                    text: "La red tiene asociados sensores por esto no se puede eliminar!",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                });
            }
        },
        error: function (e) {
            //document.getElementById('spinnerLogin').classList.add("hidden");
            alert("Error en el servidor");
        }
    });
}

function delete_network(network) {
    swal({
        title: "Alerta!",
        text: "Esta seguro de eliminar esta red?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#444a53",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(){
        dele_network(network);
    });
}

function loadNetwork(email) {
    $.ajax({
        type: "post",
        url: "http://localhost:3000/data/networks",
        data: {email: email},
        success: function (result) {
            //alert(result.msg);
            if (result.code == "001"){
                loadtable(result.data);
            }else if(result.code == "002"){
                //alert("no llego info");
                loadDataTable();
            }
        },
        error: function (e) {
            //document.getElementById('spinnerLogin').classList.add("hidden");
            alert("Error en el servidor");
        }
    });
}

function loadtable(data) {

    for( var i = 0; i < data.length; i++) {

        dataNetworks[data[i].PK_NETWORK] = data[i];

        var date = data[i].CREATEDDATE_NETWORK.toString();
        var dateArrayC = date.split("T");
        date = data[i].UPDATEDATE_NETWORK.toString();
        var dateArrayU = date.split("T");

        pk_user = data[i].PK_USER;

        $('#table_networks > tbody').append("<tr>" +
            "<td>"+data[i].NAME_NETWORK+"</td>" +
            "<td>"+data[i].ADDRESS_NETWORK+"</td>" +
            "<td id='number_sensor_"+i+"'></td>" +
            "<td>"+data[i].STATUS_NETWORK+"</td>" +
            "<td>"+dateArrayC[0]+"</td>" +
            "<td>"+dateArrayU[0]+"</td>" +
            "<td class='actions'>" +
                "<a onclick='edit_network("+data[i].PK_NETWORK+")' class='' style='color: #DBA901; margin-right: 5px;'><i class='fa fa-pencil'></i></a>"+
                "<a onclick='delete_network("+data[i].PK_NETWORK+")' class='' style='color: #B40404'><i class='fa fa-trash-o'></i></a>"+
            "</td>" +
            "</tr>");
        loadSensorsByNetowrk(data[i].PK_NETWORK, i);
    }
    //console.log(dataNetworks[1].NAME_NETWORK);
    loadDataTable();
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

function loadSensorsByNetowrk(network, i) {
    $.ajax({
        type: "post",
        async: true,
        url: "http://localhost:3000/data/sensors_networks",
        data: {network: network},
        success: function (result) {
            //alert(result.msg);
            if (result.code == "001"){
                document.getElementById("number_sensor_"+i).innerHTML = result.data[0].SENSORS;
            }else if(result.code == "002"){
                alert("no llego info");
            }
        },
        error: function (e) {
            //document.getElementById('spinnerLogin').classList.add("hidden");
            alert("Error en el servidor");
        }
    });
}

function edit_network(network) {
    $("#edit_network").modal();
    document.getElementById("edit_name_network").value = dataNetworks[network].NAME_NETWORK;
    document.getElementById("edit_address_network").value = dataNetworks[network].ADDRESS_NETWORK;
    $('#edit_status_netowrk').val(dataNetworks[network].STATUS_NETWORK);
    document.getElementById("saveEditNetwork").setAttribute('onclick', 'saveEditNetwork('+network+')');
}

function saveEditNetwork(network){
    var name_network = document.getElementById("edit_name_network").value;
    var address_network = document.getElementById("edit_address_network").value;
    var status_network = $('#edit_status_netowrk').val();

    if ((name_network != dataNetworks[network].NAME_NETWORK) || (address_network != dataNetworks[network].ADDRESS_NETWORK) || (status_network != dataNetworks[network].STATUS_NETWORK) ){
        swal({
            title: "Alerta!",
            text: "Desea guardar los cambios?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#444a53",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function(isConfirm){
            if (isConfirm) {
                saveNetwork(network, name_network, address_network, status_network);
                //swal("Eliminado!", "Se ha eliminado corectamente.", "success");
            }
        });
    }else{
        $('#edit_network').modal('hide');
    }
}

function saveNetwork(network, name, address, status) {
    $.ajax({
        type: "post",
        url: "http://localhost:3000/data/update_network",
        data: {network: network, name: name, address: address, status: status},
        success: function (result) {
            //alert(result.msg);
            if (result.code == "001"){
                swal({
                    title: "Alerta",
                    text: "Se ha actualizado satisfactoriamente la información!",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                }, function(){
                    $('#edit_network').modal('hide');
                    document.location = "/network";
                });
            }else if(result.code == "002"){
                alert("no se actualizo la red");
            }
        },
        error: function (e) {
            //document.getElementById('spinnerLogin').classList.add("hidden");
            alert("Error en el servidor");
        }
    });
}

function addNetworkModal() {
    $('#add_network').modal();
    document.getElementById("saveAddNetwork").setAttribute('onclick', 'saveAddNetwork()');
}

function saveAddNetwork() {
    var name = document.getElementById("add_name_network").value;
    var address = document.getElementById("add_address_network").value;
    var status = $('#add_status_network').val();

    if (name != "" || address != ""){
        saveNewNetwork(name, address, status);
    }else{
        swal({
            title: "Alerta",
            text: "Por favor complete todo los campos!",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#444A53",
            confirmButtonText: "OK",
            closeOnConfirm: true
        });
    }
}

function saveNewNetwork(name, address, status) {
    $.ajax({
        type: "post",
        url: "http://localhost:3000/data/create_network",
        data: {user: pk_user,name: name, address: address, status: status},
        success: function (result) {
            //alert(result.msg);
            if (result.code == "001"){
                swal({
                    title: "Alerta",
                    text: "Se ha creado la nueva red "+name+"!",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                }, function(){
                    $('#edit_network').modal('hide');
                    document.location = "/network";
                });
            }else if(result.code == "002"){
                alert("no se actualizo la red");
            }
        },
        error: function (e) {
            //document.getElementById('spinnerLogin').classList.add("hidden");
            alert("Error en el servidor");
        }
    });
}