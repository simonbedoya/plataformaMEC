/**
 * Created by sbv23 on 27/12/2016.
 */
'use strict';
let maps;
let markers;
let locationns = {lat: 2.4503137, lng: -76.6164085};
let dataNetworksSensor;
let pk_sensor = 0;
let firstLoad = 0;
let graph;

function initMap() {
    let mapDiv = document.getElementById('map_location_sensor');
    maps = new google.maps.Map(mapDiv, {
        center: locationns,
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
        url: "https://plataformamec.com/data/networks",
        data: {email: email},
        success: function (result) {
            if (result.code === "001") {
                loadSelectorNetwork(result.data);
            } else if (result.code === "002") {
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

function loadDataSensors(email) {
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/sensors",
        data: {email: email},
        success: function (result) {
            //alert(result.msg);
            if (result.code === "001") {
                loadListSensors(result.data, true);
            } else if (result.code === "002") {
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

function loadListSensors(data, load) {

    //language=JQuery-CSS
    $('#table_sensors').find('> tbody').empty();

    if(data === null){
        $('#table_sensors').find('> tbody').append(`<tr><td colspan="5">No hay sensores asociados</td></tr>`);
        return;
    }


    dataNetworksSensor = [];

    for (let i = 0; i < data.length; i++) {

    dataNetworksSensor[data[i].PK_SENSOR] = data[i];
    let date = data[i].REGISTERDATE_SENSOR.toString();
    let dateArrayC = date.split("T");

    //language=HTML
    $('#table_sensors').find('> tbody').append(`<tr><td>${data[i].SERIAL_SENSOR}</td>` +
        `<td>${data[i].NAME_SENSOR}</td>` +
        `<td>${data[i].STATUS_SENSOR}</td>` +
        `<td>${data[i].NAME_NETWORK}</td>` +
        `<td>${dateArrayC[0]}</td>` +
        `<td class='actions'>` +
        `<a onclick='showInfo_sensor(${data[i].PK_SENSOR})' class='' data-toggle='tooltip' data-placement='bottom' title='Detalles' style='color: #0101DF; margin-right: 10px;'><i class='ion-clipboard'></i></a>` +
        `<a onclick='showLocation_sensor(${data[i].PK_SENSOR})' class='' data-toggle='tooltip' data-placement='bottom' title='Ubicación' style='color: #424242; margin-right: 10px;'><i class='ion-location'></i></a>` +
        `<a href='/graphic?id=${data[i].SERIAL_SENSOR}' class='' data-toggle='tooltip' data-placement='bottom' title='Graficas' style='color: #0B610B; margin-right: 10px;'><i class='ion-stats-bars'></i></a>` +
        `<a onclick='showRealTime(${data[i].PK_SENSOR},"${data[i].NAME_SENSOR}")' class='' data-toggle='tooltip' data-placement='bottom' title='Real Time' style='color: #240B3B; margin-right: 10px;'><i class='ion-ios7-timer-outline'></i></a>` +
        `<a onclick='showEdit_sensor(${data[i].PK_SENSOR})' class='' data-toggle='tooltip' data-placement='bottom' title='Editar' style='color: #DBA901; margin-right: 10px;'><i class='ion-edit'></i></a>` +
        `<a onclick='showConfig_sensor(${data[i].PK_SENSOR})' class='' data-toggle='tooltip' data-placement='bottom' title='Configurar' style='color: #DF7401; margin-right: 10px;'><i class='ion-wrench'></i></a>` +
        `<a onclick='delete_sensor(${data[i].PK_SENSOR})' class='' data-toggle='tooltip' data-placement='bottom' title='Eliminar' style='color: #B40404'><i class='ion-trash-a'></i></a>` +
        `</td></tr>`);
}
    if (load) {
        loadDataTable(load);
    }
}

function loadSelectorNetwork(data) {
    for (let i = 0; i < data.length; i++) {
        $('#select_network').append(`<option value='${data[i].PK_NETWORK}'>${data[i].NAME_NETWORK}</option>`);
    }
}

function loadDataTable() {

    if (firstLoad === 0) {
        let table = $("#table_sensors").DataTable({
            processing: true,
            dom: "Bfrtip",
            buttons: [{extend: "copy", className: "btn-sm"}, {extend: "csv", className: "btn-sm"}, {
                extend: "excel",
                className: "btn-sm"
            }, {extend: "pdf", className: "btn-sm"}, {extend: "print", className: "btn-sm"}],
            responsive: !0
        });
        firstLoad = 1;
    }
    //table.clear();
    //table.draw();
    //TableManageButtons.table_sensor();
}

function filterSensorByNetwork(email) {
    //alert("change");
    let pk_network = $('#select_network').val();
    if(pk_network !== "0") {
        $.ajax({
            type: "post",
            url: "https://plataformamec.com/data/sensorsByNetwork",
            data: {pk_network: pk_network},
            success: function (result) {
                //alert(result.msg);
                if (result.code === "001") {
                    loadListSensors(result.data, true);
                } else if (result.code === "003") {
                    swal({
                        title: "Información",
                        text: "Ha ocurrido un error intenta de nuevo!",
                        type: "info",
                        showCancelButton: false,
                        confirmButtonColor: "#444a53",
                        confirmButtonText: "OK"
                    }).then(function () {

                    });
                } else if(result.code === "002"){
                    swal({
                        title: "Información",
                        text: "Esta red no tiene sensores asociados!",
                        type: "info",
                        showCancelButton: false,
                        confirmButtonColor: "#444a53",
                        confirmButtonText: "OK"
                    }).then(function () {
                        loadListSensors(null, true);
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
    }else{
        loadDataSensors(email);
    }
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
    }, function (isConfirm) {
        if (isConfirm) {
            swal("Eliminado!", "Se ha eliminado corectamente.", "success");
        } else {
            swal("Cancelado", "Se ha cancelado", "error");
        }
    });
}

function showInfo_sensor(pkSensor) {
    pk_sensor = pkSensor;
    reloadTabs();
    $("#info_sensor").modal();
    loadInfoGeneral();
}

$("#location_sensor").on('shown.bs.modal', function () {
    initMap();
    let image = "img/sensor.png";
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getLocationByPkSensor",
        data: {pk_sensor: pk_sensor},
        success: function (result) {
            if (result.code === "001"){
                let lat = result.data[0].LAT_LOCATION;
                let lng = result.data[0].LNG_LOCATION;
                /*let oriLat = lat.slice(lat.length-1);
                let oriLong = lng.slice(lng.length-1);
                let minLat = parseInt(lat.slice(0,2));
                let minLng = parseInt(lng.slice(0,3));
                let segLat = parseFloat(lat.slice(2,lat.length-1));
                let segLng = parseFloat(lng.slice(3,lng.length-1));
                let latFin = minLat + (segLat / 60);
                let lngFin = minLng + (segLng / 60);
                if(oriLat !== "N"){
                    latFin = latFin * -1;
                }
                if(oriLong === "W"){
                    lngFin = lngFin * -1
                }*/
                let locationSensor = {lat: getLatitude(lat), lng: getLongitude(lng)};
                markers = new google.maps.Marker({
                    position: locationSensor,
                    icon: image,
                    title: result.data[0].NAME_SENSOR + ", " + result.data[0].NAME_NETWORK + ", " + result.data[0].ADDRESS_NETWORK
                });
                markers.setMap(maps);
                maps.panTo(locationSensor);
                /*google.maps.event.addListener(marker,'click',(function (marker, i) {
                 return function () {
                 loadGraphicSensor(result.controller[i].SERIAL_SENSOR);
                 }
                 })(marker,i));*/

            }else if(result.code === "002"){
                swal({
                    title: "Información",
                    text: "Este sensor no tiene una ubicación registrada!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    showLocation_sensor(pk_sensor);
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
                showLocation_sensor(pk_sensor);
            });
        }
    });
});

function getLatitude(lat) {
    let oriLat = lat.slice(lat.length-1);
    let minLat = parseInt(lat.slice(0,2));
    let segLat = parseFloat(lat.slice(2,lat.length-1));
    let latFin = minLat + (segLat / 60);
    if(oriLat !== "N"){
        latFin = latFin * -1;
    }
    return latFin;
}

function getLongitude(lng) {
    let oriLong = lng.slice(lng.length-1);
    let minLng = parseInt(lng.slice(0,3));
    let segLng = parseFloat(lng.slice(3,lng.length-1));
    let lngFin = minLng + (segLng / 60);
    if(oriLong === "W"){
        lngFin = lngFin * -1
    }
    return lngFin;
}

function showLocation_sensor(pkSensor) {
    pk_sensor = pkSensor;
    $("#location_sensor").modal();

}

function showEdit_sensor(sensor) {
    $("#edit_sensor").modal();
    document.getElementById("edit_name_sensor").value = dataNetworksSensor[sensor].NAME_SENSOR;
    pk_sensor = sensor;
}

function showConfig_sensor(pkSensor) {
    reloadTabsConfig();
    pk_sensor = pkSensor;
    $("#config_sensor").modal();
}

function loadInfoGeneral() {
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getInfoSensor",
        data: {pk_sensor: pk_sensor},
        success: function (result) {
            if (result.code === "001") {
                setInfoGeneral(result.data);
            } else if (result.code === "003") {
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    loadInfoGeneral()
                });
            }else if(result.code === "002"){
                setInfoGeneral(null);
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
                loadInfoGeneral()
            });
        }
    });
}

function setInfoGeneral(data) {
    aciveLoader("loadGeneral",false);
    if(data !== null) {
        let dateReg = datetime(data.REGISTERDATE_SENSOR);
        //let date = data.REGISTERDATE_SENSOR.toString();
        //let dateReg = date.split("T");
        //let hourReg = dateReg[1].split(".");
        let dateUp = datetime(data.UPDATEDATE_SENSOR);
        //let dateUp = date.split("T");
        //let hourUp = dateUp[1].split(".");
        document.getElementById("tisgSerial").innerHTML = data.SERIAL_SENSOR;
        document.getElementById("tisgName").innerHTML = data.NAME_SENSOR;
        document.getElementById("tisgStatus").innerHTML = data.STATUS_SENSOR;
        document.getElementById("tisgRegDate").innerHTML = dateReg;
        document.getElementById("tisgUpDate").innerHTML = dateUp;
    }else{
        document.getElementById("tisgSerial").innerHTML = "No hay registro";
        document.getElementById("tisgName").innerHTML = "No hay registro";
        document.getElementById("tisgStatus").innerHTML = "No hay registro";
        document.getElementById("tisgRegDate").innerHTML = "No hay registro";
        document.getElementById("tisgUpDate").innerHTML = "No hay registro";
    }
}

function datetime(dates) {
    let date = new Date(dates.toString());
    console.log(date);

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let second = date.getSeconds();
    let minute = date.getMinutes();
    let hour = date.getHours();
    let finalsecond = "";
    let finalminute = "";
    let finalhour = "";
    let finalday = "";
    let finalmonth = "";

    if (day >= 1 && day <= 9){
        finalday = "0" + day.toString();
    }else{
        finalday = day.toString();
    }
    if(month >= 0 && month <=9){
        finalmonth = "0" + (month + 1).toString();
    }else{
        finalmonth = month.toString();
    }
    if (second >= 0 && second <= 9){
        finalsecond = "0" + second.toString();
    }else{
        finalsecond = second;
    }
    if (minute >= 0 && minute <= 9){
        finalminute = "0" + minute.toString();
    }else{
        finalminute = minute;
    }
    if (hour >= 0 && hour <= 9){
        finalhour = "0" + hour.toString();
    }else{
        finalhour = hour;
    }
    return year.toString() + "/" + finalmonth + "/" + finalday + " " + finalhour + ":" + finalminute + ":" + finalsecond;
};

function clearInfoGeneral() {
    document.getElementById("tisgSerial").innerHTML = "";
    document.getElementById("tisgName").innerHTML = "";
    document.getElementById("tisgStatus").innerHTML = "";
    document.getElementById("tisgRegDate").innerHTML = "";
    document.getElementById("tisgUpDate").innerHTML = "";
}

function save_edit_sensor() {
    let name = document.getElementById("edit_name_sensor").value;
    if (name !== dataNetworksSensor[pk_sensor].NAME_SENSOR) {
        swal({
            title: "Alerta!",
            text: "Desea guardar los cambios?",
            type: "warning",
            showCloseButton: true,
            confirmButtonColor: "#444a53",
            confirmButtonText: "Si",
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return saveEditSensor(pk_sensor, name);
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
                    document.location = "/sensor";
                })
            }
        }, function (dismiss) {

        });

    } else {
        $("#edit_sensor").modal('hide');
    }
}

function saveEditSensor(pk_sensor, name) {
    return new Promise(
        function (resolve, reject) {
            $.ajax({
                type: "post",
                url: "https://plataformamec.com/data/updateNameSensor",
                data: {pk_sensor: pk_sensor, name: name},
                success: function (result) {
                    //alert(result.msg);
                    if (result.code === "001") {
                        resolve({code: "001"});
                    } else if (result.code === "002") {
                        reject("No se pudo actualizar el sensor");
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

function aciveLoader(id,active) {
    if(active){
        document.getElementById(id).style.display = "block";
    }else{
        document.getElementById(id).style.display = "none";
    }
}

$("#tabGeneral").click(function () {
    clearInfoGeneral();
    aciveLoader("loadGeneral",true);
    loadInfoGeneral();
});

$("#tabLocation").click(function () {
    clearInfoLocation();
    aciveLoader("loadLocation",true);
    loadInfoLocation();
});


function loadInfoLocation() {
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getLocationSensor",
        data: {pk_sensor: pk_sensor},
        success: function (result) {
            if (result.code === "001") {
                setInfoLocation(result.data);
            } else if (result.code === "003") {
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    loadInfoLocation()
                });
            }else if(result.code === "002"){
                setInfoLocation(null);
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
                loadInfoLocation()
            });
        }
    });
}

function setInfoLocation(data) {
    aciveLoader("loadLocation",false);
    if(data !== null) {

        document.getElementById("tislLat").innerHTML = getLatitude(data.LAT_LOCATION);
        document.getElementById("tislLng").innerHTML = getLongitude(data.LNG_LOCATION);
        document.getElementById("tislAlt").innerHTML = data.ALT_LOCATION + " m.s.n.m";
        //document.getElementById("tislAddress").innerHTML = data.ADDRESS_LOCATION;
    }else{
        document.getElementById("tislLat").innerHTML = "No hay registro";
        document.getElementById("tislLng").innerHTML = "No hay registro";
        document.getElementById("tislAlt").innerHTML = "No hay registro";
        //document.getElementById("tislAddress").innerHTML = "No hay registro";
    }
}

function clearInfoLocation() {
    document.getElementById("tislLat").innerHTML = "";
    document.getElementById("tislLng").innerHTML = "";
    document.getElementById("tislAlt").innerHTML = "";
    //document.getElementById("tislAddress").innerHTML = "";
}

function reloadTabs() {
    let tabs = ["tabGeneral", "tabLocation", "tabNetwork", "tabAlert", "tabComponent"];
    let tabPanels = ["general", "location", "network", "alerts", "component"];
    for(i in tabs){
        $(`#${tabs[i]}`).removeClass("active");
    }
    for(i in tabPanels){
        $(`#${tabPanels[i]}`).removeClass("active");
    }
    $(`#${tabs[0]}`).addClass("active");
    $(`#${tabPanels[0]}`).addClass("active");

}

$("#tabNetwork").click(function () {
    clearInfoNetwork();
    aciveLoader("loadNetwork",true);
    loadInfoNetwork();
});

function loadInfoNetwork() {
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getNetworkSensor",
        data: {pk_sensor: pk_sensor},
        success: function (result) {
            if (result.code === "001") {
                setInfoNetwork(result.data);
            } else if (result.code === "003") {
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    loadInfoNetwork()
                });
            } else if(result.code === "002"){
                setInfoNetwork(null);
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
                loadInfoNetwork()
            });
        }
    });
}

function setInfoNetwork(data) {
    aciveLoader("loadNetwork",false);
    if(data !== null) {
        document.getElementById("tisnIP").innerHTML = data.IPADR_WIFI;
        document.getElementById("tisnMAC").innerHTML = data.MACADR_WIFI;
        document.getElementById("tisnSSID").innerHTML = data.SSID_WIFI;
    }else{
        document.getElementById("tisnIP").innerHTML = "No hay registro";
        document.getElementById("tisnMAC").innerHTML = "No hay registro";
        document.getElementById("tisnSSID").innerHTML = "No hay registro";
    }
}

function clearInfoNetwork() {
    document.getElementById("tisnIP").innerHTML = "";
    document.getElementById("tisnMAC").innerHTML = "";
    document.getElementById("tisnSSID").innerHTML = "";
}

$("#tabAlert").click(function () {
    clearInfoAlert();
    aciveLoader("loadAlert",true);
    loadInfoAlert();
});

function loadInfoAlert() {
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getCountEvents",
        data: {pk_sensor: pk_sensor},
        success: function (result) {
            if (result.code === "001") {
                setInfoAlert(result.data);
            } else if (result.code === "003") {
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    loadInfoAlert()
                });
            } else if(result.code === "002"){
                setInfoAlert(null);
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
                loadInfoAlert()
            });
        }
    });
}

function setInfoAlert(data) {
    aciveLoader("loadAlert",false);
    if(data !== null) {
        document.getElementById("tisaLTA").innerHTML = data.countLTA;
        document.getElementById("tisaSTA").innerHTML = data.countSTA;
    }else{
        document.getElementById("tisaLTA").innerHTML = "No hay registro";
        document.getElementById("tisaSTA").innerHTML = "No hay registro";
    }
}

function clearInfoAlert() {
    document.getElementById("tisaLTA").innerHTML = "";
    document.getElementById("tisaSTA").innerHTML = "";
}


$("#tabComponent").click(function () {
    clearInfoComponent();
    aciveLoader("loadComponent",true);
    loadInfoComponent();
    document.getElementById("panelDatailsComp").innerHTML = "Seleccione un componente para ver los detalles."
});

function loadInfoComponent() {
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getStatusComponentSensor",
        data: {pk_sensor: pk_sensor},
        success: function (result) {
            if (result.code === "001") {
                setInfoComponent(result.data);
            } else if (result.code === "003") {
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    loadInfoComponent()
                });
            } else if(result.code === "002"){
                setInfoComponent(null);
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
                loadInfoComponent()
            });
        }
    });
}

function setInfoComponent(data) {
    aciveLoader("loadComponent",false);
    let components = ["CPU", "GPS", "ADC", "ACCELEROMETER", "WIFI", "RTC", "BATTERY"];
    let fields = ["tiscCPU", "tiscGPS", "tiscADC", "tiscACC", "tiscWIFI", "tiscRTC", "tiscBATT"];

    if(data !== null) {
        let fieldsBD = [data.STA_CPU,data.STA_GPS,data.STA_ADC,data.STA_ACC,data.STA_WIFI,data.STA_RTC,data.STA_BATT];
        for(i in fieldsBD){
            if(fieldsBD[i] === "Error"){
                document.getElementById(fields[i]).innerHTML = `<a onclick="showDetails('${components[i]}')"><span style="color: #ac2925">${fieldsBD[i]}</span></a>`;
            }else{
                document.getElementById(fields[i]).innerHTML = `<a onclick="showDetails('${components[i]}')"><span style="color: #0B610B">${fieldsBD[i]}</span></a>`;
            }
        }
    }else{
        document.getElementById("tiscCPU").innerHTML = "No hay registro";
        document.getElementById("tiscGPS").innerHTML = "No hay registro";
        document.getElementById("tiscADC").innerHTML = "No hay registro";
        document.getElementById("tiscACC").innerHTML = "No hay registro";
        document.getElementById("tiscWIFI").innerHTML = "No hay registro";
        document.getElementById("tiscRTC").innerHTML = "No hay registro";
        document.getElementById("tiscBATT").innerHTML = "No hay registro";
    }
}

function showPanelLoad(id,show) {
    let portlet = $(`#${id}`);
    if(show) {
        portlet.append('<div class="panel-disabled"><div class="loader-1"></div></div>');
    }else{
        let pd = portlet.find('.panel-disabled');
        pd.fadeOut('fast', function () {
            pd.remove();
        });
    }

}

function showDetails(component) {
    showPanelLoad('panelDatailsComp',true);
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getDataDetailComponent",
        data: {pk_sensor: pk_sensor, component: component},
        success: function (result) {
            if (result.code === "001") {
                setDetailComponent(result.data, component);
            } else if (result.code === "003") {
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {

                });
            } else if(result.code === "002"){
                setDetailComponent(null,component);
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
                loadInfoComponent()
            });
        }
    });
}

function setDetailComponent(data,component) {
    let panel = document.getElementById("panelDatailsComp");
    switch (component){
        case "CPU":
            panel.innerHTML = `<table id='tableDescripComponents' class='col-lg-12' border='0'><tbody><tr><th colspan='2'>Detalles CPU</th></tr><tr><td>Descripción:</td><td>${data.DESCRIPT_CPU}</td></tr><tr><td>Error:</td><td>${data.ERROR_CPU}</td></tr><tr><td>Actualización:</td><td>${datetime(data.UPDATEDATE_CPU)}</td></tr></tbody></table>`;
            break;
        case "GPS":
            panel.innerHTML = `<table id='tableDescripComponents' class='col-lg-12' border='0'><tbody><tr><th colspan='2'>Detalles GPS</th></tr><tr><td>Descripción:</td><td>${data.DESCRIPT_GPS}</td></tr><tr><td>Tasa en baudios:</td><td>${data.BAUDRATE_GPS}</td></tr><tr><td>Mensajes NMEA:</td><td>${data.MSJNMEA}</td></tr><tr><td>Error:</td><td>${data.ERROR_GPS}</td></tr><tr><td>Actualización:</td><td>${datetime(data.UPDATEDATE_GPS)}</td></tr></tbody></table>`;
            break;
        case "ADC":
            panel.innerHTML = `<table id='tableDescripComponents' class='col-lg-12' border='0'><tbody><tr><th colspan='2'>Detalles ADC</th></tr><tr><td>Descripción:</td><td>${data.DESCRIPT_ADC}</td></tr><tr><td>Muestras por segundo:</td><td>${data.SAMPLES_ADC}</td></tr><tr><td>Error:</td><td>${data.ERROR_ADC}</td></tr><tr><td>Actualización:</td><td>${datetime(data.UPDATEDATE_ADC)}</td></tr></tbody></table>`;
            break;
        case "ACCELEROMETER":
            panel.innerHTML = `<table id='tableDescripComponents' class='col-lg-12' border='0'><tbody><tr><th colspan='2'>Detalles Acelerometro</th></tr><tr><td>Descripción:</td><td>${data.DESCRIPT_ACCELEROMETER}</td></tr><tr><td>Error:</td><td>${data.ERROR_ACCELEROMETER}</td></tr><tr><td>Actualización:</td><td>${datetime(data.UPDATEDATE_ACCELEROMETER)}</td></tr></tbody></table>`;
            break;
        case "WIFI":
            panel.innerHTML = `<table id='tableDescripComponents' class='col-lg-12' border='0'><tbody><tr><th colspan='2'>Detalles WIFI</th></tr><tr><td>Descripción:</td><td>${data.DESCRIPT_WIFI}</td></tr><tr><td>SSID:</td><td>${data.SSID_WIFI}</td></tr><tr><td>Dirección IP:</td><td>${data.IPADR_WIFI}</td></tr><tr><td>Direccion Fisica:</td><td>${data.MACADR_WIFI}</td></tr><tr><td>Error:</td><td>${data.ERROR_WIFI}</td></tr><tr><td>Actualización:</td><td>${datetime(data.UPDATEDATE_WIFI)}</td></tr></tbody></table>`;
            break;
        case "RTC":
            panel.innerHTML = `<table id='tableDescripComponents' class='col-lg-12' border='0'><tbody><tr><th colspan='2'>Detalles RTC</th></tr><tr><td>Descripción:</td><td>${data.DESCRIPT_RTC}</td></tr><tr><td>Fecha y hora:</td><td>${data.DATEHOUR_RTC}</td></tr><tr><td>Error:</td><td>${data.ERROR_RTC}</td></tr><tr><td>Actualización:</td><td>${datetime(data.UPDATEDATE_RTC)}</td></tr></tbody></table>`;
            break;
        case "BATTERY":
            panel.innerHTML = `<table id='tableDescripComponents' class='col-lg-12' border='0'><tbody><tr><th colspan='2'>Detalles bateria</th></tr><tr><td>Descripción:</td><td>${data.DESCRIPT_BATTERY}</td></tr><tr><td>Carga:</td><td>${data.CHARGE_BATTERY}</td></tr><tr><td>Error:</td><td>${data.ERROR_BATTERY}</td></tr><tr><td>Actualización:</td><td>${datetime(data.UPDATEDATE_BATTERY)}</td></tr></tbody></table>`;
            break;
    }
}



function clearInfoComponent() {
    document.getElementById("tiscCPU").innerHTML = "";
    document.getElementById("tiscGPS").innerHTML = "";
    document.getElementById("tiscADC").innerHTML = "";
    document.getElementById("tiscACC").innerHTML = "";
    document.getElementById("tiscWIFI").innerHTML = "";
    document.getElementById("tiscRTC").innerHTML = "";
    document.getElementById("tiscBATT").innerHTML = "";
}

function requestTest(component) {
    let type = "";
    switch (component){
        case "GPS":
            type = $(`#typeTest${component}`).val();
            break;
        case "ADC":
            type = "";
            break;
        case "ACC":
            type = "";
            break;
        case "WIFI":
            type = "";
            break;
        case "RTC":
            type = $(`#typeTest${component}`).val();
            break;
        case "BAT":
            type = "";
            break;
    }

    socket.emit('requestTest',`{"pk_sensor": "${pk_sensor}", "component" : "${component}", "type" : "${type}" }`,function (data) {
        if(data.code === "001"){
            document.getElementById(`resultTest${component}`).innerHTML = `Ha comanzado el test al ${component}. \n`;
        }else if(data.code === "004"){
            document.getElementById(`resultTest${component}`).innerHTML = "Ya se encuentra un test corriendo para este sensor.";
        }else if(data.code === "003"){
            document.getElementById(`resultTest${component}`).innerHTML = "El sensor no se encuentra conectado, intenta nuevamente.";
        }else{
            document.getElementById(`resultTest${component}`).innerHTML = "Ha ocurrido un error intenta nuevamente.";
        }
    })
}

function clearTextAreaTest(id, component) {
    document.getElementById(id).innerHTML = `Resultado funcionamiento y recepcion del ${component}`;
}

function showRealTime(pkSensor, name) {
    pk_sensor = pkSensor;
    document.getElementById("titleRealTimeGraphic").innerHTML += name;
    $('#real_time_graphic').modal();
}

let chartData = [];
let chartRealTime;
let day = 0;
let mili = 0;
let firstDate;


$("#real_time_graphic").on('hidden.bs.modal', function () {
    $('#divButtonGraphic').addClass('hidden');
    document.getElementById("divcontainer").innerHTML = "<div id='chartdiv' style='width: 100%; height: 400px;'></div>"+
                                                            "<div style='margin-left:35px;'>"+
                                                            "<input type='radio' checked='true' name='group' id='rb1' onclick='setPanSelect()'>Select"+
                                                            "<input type='radio' name='group' id='rb2' onclick='setPanSelect()'>Pan"+
                                                        "</div>";
});

function drawGraphic(){
    $('#divButtonGraphic').removeClass('hidden');
    let axisSelect = $('#selectedAxis').val();
    let valueAxes, graphs = [];
    if(axisSelect !== "0"){
        valueAxes = [{'axisAlpha': 0.2,'id': 'g1'}];
        graphs = [{
            "id": "g1",
            "valueField": axisSelect,
            "bullet": "round",
            "balloonText": `${axisSelect} : [[value]]`,
            "title": axisSelect,
            "bulletBorderColor": "#FFFFFF",
            "bulletBorderThickness": 2,
            "lineThickness": 2,
            "lineColor": "#08088A",
            "negativeLineColor": "#08088A",
            "hideBulletsCount": 50
        }];
    }else{
        valueAxes = [{ 'axisAlpha': 0.2, 'id': 'g1'},{ 'axisAlpha': 0.2,'id': 'g2'},{'axisAlpha': 0.2,'id': 'g3'}];
        graphs = [{
            "id": "g1",
            "valueField": "BH1",
            "bullet": "round",
            "balloonText": "BH1: [[value]]",
            "title": "BH1",
            "bulletBorderColor": "#FFFFFF",
            "bulletBorderThickness": 2,
            "lineThickness": 2,
            "lineColor": "#08088A",
            "negativeLineColor": "#08088A",
            "hideBulletsCount": 50
        },
            {
                "id": "g2",
                "valueField": "BH2",
                "bullet": "round",
                "balloonText": "BH2: [[value]]",
                "title": "BH2",
                "bulletBorderColor": "#FFFFFF",
                "bulletBorderThickness": 2,
                "lineThickness": 2,
                "lineColor": "#8A0808",
                "negativeLineColor": "#8A0808",
                "hideBulletsCount": 50
            },
            {
                "id": "g3",
                "valueField": "BHZ",
                "bullet": "round",
                "balloonText": "BHZ: [[value]]",
                "title": "BHZ",
                "bulletBorderColor": "#FFFFFF",
                "bulletBorderThickness": 2,
                "lineThickness": 2,
                "lineColor": "#0B3B0B",
                "negativeLineColor": "#0B3B0B",
                "hideBulletsCount": 50
            }];
    }



    socket.emit('requestTest',`{"pk_sensor": "${pk_sensor}", "component" : "REAL_TIME", "type" : "${axisSelect}" }`,function (data) {
        console.log("responde solicitud real time");
        console.log(data);
        if(data.code === "001"){
            loadChart(axisSelect,valueAxes,graphs);
            changeButton();
        }else if(data.code === "004"){
            alert("Ya se encuentra un test corriendo para este sensor.");
            //document.getElementById(`resultTest${component}`).innerHTML = "Ya se encuentra un test corriendo para este sensor.";
        }else if(data.code === "003"){
            alert("El sensor no se encuentra conectado, intenta nuevamente.");
            //document.getElementById(`resultTest${component}`).innerHTML = "El sensor no se encuentra conectado, intenta nuevamente.";
        }else{
            alert("Ha ocurrido un error intenta nuevamente.");
            //document.getElementById(`resultTest${component}`).innerHTML = "Ha ocurrido un error intenta nuevamente.";
        }
    })
}

function saveConfigADC(){
    let samplesADC = $('#samplesADC').val();
    socket.emit('setSPS',`{"pk_sensor": "${pk_sensor}", "sps" : "${samplesADC}"}`,function (data) {
        if(data.code === "001"){
            document.getElementById("processConfigADC").innerHTML = "Enviando datos de configuración...";
        }else if(data.code === "004"){
            document.getElementById("processConfigADC").innerHTML = "El sensor no se encuentra conectado.";
        }else{
            document.getElementById("processConfigADC").innerHTML = "Ha ocurrido un problema, intenta de nuevo.";
        }
    })
}

function changeButton() {
    document.getElementById("btnRealTime").innerHTML = "Detener";
    document.getElementById("btnRealTime").setAttribute("onclick","stopRealTime()");
}

function stopRealTime() {
    socket.emit('requestTest',`{"pk_sensor": "${pk_sensor}", "component" : "REAL_TIME", "type" : "STOP" }`,function (data) {
        console.log(data);
        if(data.code === "001"){
            document.getElementById("btnRealTime").innerHTML = "Conectar";
            document.getElementById("btnRealTime").setAttribute("onclick","drawGraphic()");
        }
    })
}

function loadChart(axisSelect,valueAxes,graphs) {
    seconds = 0;
    mili = 0;
    chartData = [];
    firstDate = new Date();
    firstDate.setDate( firstDate.getDate());
    chartRealTime = AmCharts.makeChart( "chartdiv", {
        "type": "serial",
        "theme": "light",
        "language": "es",
        "zoomOutButton": {
            "backgroundColor": '#000000',
            "backgroundAlpha": 0.15
        },
        "dataProvider": generateChartData(axisSelect),
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "minPeriod": "fff",
            "dashLength": 1,
            "gridAlpha": 0.15,
            "minorGridEnabled": true,
            "axisColor": "#DADADA",
            "dateFormats": [{"period":"fff","format":"JJ:NN:SS"},{"period":"ss","format":"JJ:NN:SS"},{period:'mm',format:'JJ:NN'},{period:'hh',format:'JJ:NN'}]
        },
        "valueAxes": valueAxes,
        "graphs": graphs,
        "chartCursor": {
            "cursorAlpha": 0,
            "zoomable": false,
            "valueZoomable":true
        },
        "chartScrollbar": {
            "graph": "g1",
            "scrollbarHeight": 40,
            "color": "#FFFFFF",
            "autoGridCount": true
        },
        "export": {
            "enabled": true,
            "position": "bottom-left"
        },
        "valueScrollbar":{

        }
    });


}

let newDate;
// generate some random data, quite different range
function generateChartData(axis) {
    let chartData = [];
    firstDate.setMilliseconds(firstDate.getMilliseconds() - 60000);
    for ( let i = 0; i < 600; i++ ) {

        newDate = new Date(firstDate);
        //newDate.setHours(0,0,0,(i*100));
        newDate.setMilliseconds(newDate.getMilliseconds() + i*100);

        let data;
        if(axis !== "0"){
            switch (axis){
                case "BH1":
                    data = {
                        "date": newDate,
                        "BH1": 0
                    };
                    break;
                case "BH2":
                    data = {
                        "date": newDate,
                        "BH2": 0
                    };
                    break;
                case "BHZ":
                    data = {
                        "date": newDate,
                        "BHZ": 0
                    };
                    break;
            }
        }else{
            data = {
                "date": newDate,
                "BH1": 0,
                "BH2": 0,
                "BHZ": 0,
            }
        }
        chartData.push(data);
    }

    return chartData;
}

// changes cursor mode from pan to select
function setPanSelect() {
    let chartCursor = chartRealTime.chartCursor;

    if (document.getElementById("rb1").checked) {
        chartCursor.pan = false;
        chartCursor.zoomable = true;

    } else {
        chartCursor.pan = true;
    }
    chartRealTime.validateNow();
}

$("#tabConfigADC").click(function () {
   loadSamplesADC();
});

function loadSamplesADC(){
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getSamplesADCBySensor",
        data: {pk_sensor: pk_sensor},
        success: function (result) {
            if (result.code === "001") {
                document.getElementById("samplesADC").disabled = false;
                $("#samplesADC").val(result.data.SAMPLES_ADC);
            } else if (result.code === "003") {
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {
                    $("#config_sensor").modal('hide');
                });
            } else if(result.code === "002"){
                swal({
                    title: "Información",
                    text: "No se puede configurar por falta de información!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {

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
                $("#config_sensor").modal('close');
            });
        }
    });
}

function reloadTabsConfig() {
    let tabs = ["tabConfigCPU", "tabConfigGPS", "tabConfigADC", "tabConfigACC", "tabConfigWIFI", "tabConfigRTC","tabConfigBAT"];
    let tabPanels = ["cpu", "gps", "adc", "acelerometro", "acelerometro", "rtc", "bateria"];
    for(i in tabs){
        $(`#${tabs[i]}`).removeClass("active");
    }
    for(i in tabPanels){
        $(`#${tabPanels[i]}`).removeClass("active");
    }
    $(`#${tabs[0]}`).addClass("active");
    $(`#${tabPanels[0]}`).addClass("active");

}