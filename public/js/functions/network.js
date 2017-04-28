/**
 * Created by sbv23 on 27/12/2016.
 */
'use strict';
let dataNetworks = [];
let pk_user = 0;

function delet_network(network) {
    return new Promise(
        function (resolve, reject) {
            $.ajax({
                type: "post",
                url: "https://plataformamec.com/data/delete_network",
                data: {network: network},
                success: function (result) {
                    //alert(result.msg);
                    if (result.code === "001"){
                        resolve({code: "001"});
                    }else if(result.code === "002"){
                        reject("No se puede eliminar por que tiene sensores asociados a esta red");
                    }
                },
                error: function (e) {
                    console.log(e);
                    reject("Problema interno, intenta nuevamente");
                }
            });
        }
    )
}

function delete_network(network) {
    swal({
        title: "Alerta!",
        text: "Esta seguro de eliminar esta red?, se eliminaran todos los registros asociados a ella.",
        type: "warning",
        showCloseButton: true,
        confirmButtonColor: "#444a53",
        confirmButtonText: "Si",
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return delet_network(network);
        }
    }).then(function(data){
        if(data.code === "001"){
            swal({
                title: "Alerta",
                text: "Se ha eliminado satisfactoriamente la red!",
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#444a53",
                confirmButtonText: "OK"
            }).then(function () {
                document.location = "/network";
            })
        }
    }, function (dismiss) {
        
    })
}

function loadNetwork(email) {
    reloadNumberNoReadNotification(email);
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/networks",
        data: {email: email},
        success: function (result) {
            if (result.code === "001"){
                loadTable(result.data);
            }else if(result.code === "002"){
                loadDataTable();
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
                loadNetwork(email);
            });
        }
    });
}

function loadTable(data) {
    for (let i = 0; i < data.length; i++) {

        dataNetworks[data[i].PK_NETWORK] = data[i];

        let date = data[i].CREATEDDATE_NETWORK.toString();
        let dateArrayC = date.split("T");
        date = data[i].UPDATEDATE_NETWORK.toString();
        let dateArrayU = date.split("T");

        pk_user = data[i].PK_USER;

        //language=HTML
        $('#table_networks').find('> tbody').append(`<tr>` +
            `<td>${data[i].NAME_NETWORK}</td>` +
            `<td>${data[i].ADDRESS_NETWORK}</td>` +
            `<td id='number_sensor_${i}'></td>` +
            `<td>${data[i].STATUS_NETWORK}</td>` +
            `<td>${dateArrayC[0]}</td>` +
            `<td>${dateArrayU[0]}</td>` +
            `<td class='actions'>` +
            `<a onclick='edit_network(${data[i].PK_NETWORK})' class='' style='color: #DBA901; margin-right:5px;'><i class='fa fa-pencil'></i></a>` +
            `<a onclick='delete_network(${data[i].PK_NETWORK})' class='' style='color: #B40404'><i class='fa fa-trash-o'></i></a>` +
            `</td>` +
            `</tr>`);
        loadSensorsByNetowrk(data[i].PK_NETWORK, i);
    }
    loadDataTable();
}

function loadDataTable() {
    TableManageButtons.table_network();
}

function loadSensorsByNetowrk(network, i) {
    $.ajax({
        type: "post",
        async: true,
        url: "https://plataformamec.com/data/sensors_networks",
        data: {network: network},
        success: function (result) {
            if (result.code === "001"){
                document.getElementById("number_sensor_"+i).innerHTML = result.data[0].SENSORS;
            }else if(result.code === "002"){
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    loadSensorsByNetowrk(network, i);
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
                loadSensorsByNetowrk(network, i);
            });
        }
    });
}

function edit_network(network) {
    //language=JQuery-CSS
    $("#edit_network").modal();
    document.getElementById("edit_name_network").value = dataNetworks[network].NAME_NETWORK;
    document.getElementById("edit_address_network").value = dataNetworks[network].ADDRESS_NETWORK;
    //language=JQuery-CSS
    $("#edit_status_network").val(dataNetworks[network].STATUS_NETWORK);
    document.getElementById("saveEditNetwork").setAttribute('onclick', `saveEditNetwork(${network})`);
}

function saveEditNetwork(network){
    let name_network = document.getElementById("edit_name_network").value;
    let address_network = document.getElementById("edit_address_network").value;
    let status_network = $('#edit_status_network').val();

    if ((name_network !== dataNetworks[network].NAME_NETWORK) || (address_network !== dataNetworks[network].ADDRESS_NETWORK) || (status_network !== dataNetworks[network].STATUS_NETWORK) ){
        swal({
            title: "Alerta!",
            text: "Desea guardar los cambios?",
            type: "warning",
            showCloseButton: true,
            confirmButtonColor: "#444a53",
            confirmButtonText: "Si",
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return saveNetwork(network, name_network, address_network, status_network);
            }
        }).then(function(data){
            if(data.code === "001"){
                swal({
                    title: "Alerta",
                    text: "Se ha actualizado satisfactoriamente la información!",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    $('#edit_network').modal('hide');
                    document.location = "/network";
                })
            }
        }, function (dismiss) {

        });
    }else{
        $('#edit_network').modal('hide');
    }
}

function saveNetwork(network, name, address, status) {
    return new Promise(
        function (resolve, reject) {
            $.ajax({
                type: "post",
                url: "https://plataformamec.com/data/update_network",
                data: {network: network, name: name, address: address, status: status},
                success: function (result) {
                    if (result.code === "001"){
                        resolve({code: "001"});
                    }else if(result.code === "002"){
                        reject("No se pudo actualizar la red");
                    }
                },
                error: function (e) {
                    console.log(e);
                    reject("Problema interno, intenta nuevamente");
                }
            });
        });
}

function addNetworkModal() {
    $('#add_network').modal();
    document.getElementById("saveAddNetwork").setAttribute('onclick', 'saveAddNetwork()');
}

function saveAddNetwork() {
    let name = document.getElementById("add_name_network").value;
    let address = document.getElementById("add_address_network").value;
    //language=JQuery-CSS
    let status = $('#add_status_network').val();

    if (name !== "" || address !== "") {

        swal({
            title: "Información!",
            text: "Desea guardar la informacion?",
            type: "info",
            showCloseButton: true,
            confirmButtonColor: "#444a53",
            confirmButtonText: "Si",
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return saveNewNetwork(name, address, status);
            }
        }).then(function (data) {
            if (data.code === "001") {
                swal({
                    title: "Alerta",
                    text: `Se ha creado la nueva red ${name}!`,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    //language=JQuery-CSS
                    $('#edit_network').modal('hide');
                    document.location = "/network";
                })
            }
        }, function (dismiss) {

        });
    } else {
        swal({
            title: "Alerta",
            text: "Por favor complete todo los campos!",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#444A53",
            confirmButtonText: "OK"
        });
    }
}

function saveNewNetwork(name, address, status) {
    return new Promise(
        function (resolve, reject) {
            $.ajax({
                type: "post",
                url: "https://plataformamec.com/data/create_network",
                data: {user: pk_user,name: name, address: address, status: status},
                success: function (result) {
                    if (result.code === "001"){
                        resolve({code: "001"});
                    }else if(result.code === "002"){
                        reject("No se pudo crear la nueva red, intentalo de nuevo");
                    }else if(result.code === "003"){
                        return saveNewNetwork(name,address,status);
                    }
                },
                error: function (e) {
                    console.log(e);
                    reject("Problema interno, intenta nuevamente");
                }
            });
        });
}