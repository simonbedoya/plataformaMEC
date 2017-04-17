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
        `<a onclick='showRealTime(${data[i].PK_SENSOR})' class='' data-toggle='tooltip' data-placement='bottom' title='Real Time' style='color: #240B3B; margin-right: 10px;'><i class='ion-ios7-timer-outline'></i></a>` +
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
                let lat = parseFloat(result.data[0].LAT_LOCATION);
                let lng = parseFloat(result.data[0].LNG_LOCATION);
                let locationSensor = {lat: lat, lng: lng};
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
        document.getElementById("tislLat").innerHTML = data.LAT_LOCATION;
        document.getElementById("tislLng").innerHTML = data.LNG_LOCATION;
        document.getElementById("tislAlt").innerHTML = data.ALT_LOCATION + " m.s.n.m";
        document.getElementById("tislAddress").innerHTML = data.ADDRESS_LOCATION;
    }else{
        document.getElementById("tislLat").innerHTML = "No hay registro";
        document.getElementById("tislLng").innerHTML = "No hay registro";
        document.getElementById("tislAlt").innerHTML = "No hay registro";
        document.getElementById("tislAddress").innerHTML = "No hay registro";
    }
}

function clearInfoLocation() {
    document.getElementById("tislLat").innerHTML = "";
    document.getElementById("tislLng").innerHTML = "";
    document.getElementById("tislAlt").innerHTML = "";
    document.getElementById("tislAddress").innerHTML = "";
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
    let fields = ["tiscCPU", "tiscGPS", "tiscADC", "tiscACC", "tiscWIFI", "tiscRTC", "tiscBATT"];

    if(data !== null) {
        let fieldsBD = [data.STA_CPU,data.STA_GPS,data.STA_ADC,data.STA_ACC,data.STA_WIFI,data.STA_RTC,data.STA_BATT];
        for(i in fieldsBD){
            if(fieldsBD[i] === "Error"){
                document.getElementById(fields[i]).innerHTML = `<span style="color: #ac2925">${fieldsBD[i]}</span>`;
            }else{
                document.getElementById(fields[i]).innerHTML = `<span style="color: #0B610B">${fieldsBD[i]}</span>`;
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

function showRealTime(pkSensor) {
    pk_sensor = pkSensor;
    $('#real_time_graphic').modal();
}

var chart;

$("#real_time_graphic").on('show.bs.modal', function () {

    /*graph = new Rickshaw.Graph({
        element: document.querySelector("#realTimeGraphic"),
        height: 250,
        renderer: 'line',
        series: new Rickshaw.Series.FixedDuration([{ color: 'steelblue', name: 'Breaking Bad' }], undefined, {
            timeInterval: 1000,
            maxDataPoints: 10,
            timeBase: new Date().getTime() / 1000
        })
    });

    graph.render();*/
    chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "marginRight": 40,
        "marginLeft": 40,
        "autoMarginOffset": 20,
        "mouseWheelZoomEnabled":true,
        "dataDateFormat": "YYYY-MM-DD",
        "valueAxes": [{
            "id": "v1",
            "axisAlpha": 0,
            "position": "left",
            "ignoreAxisWidth":true
        }],
        "balloon": {
            "borderThickness": 1,
            "shadowAlpha": 0
        },
        "graphs": [{
            "id": "g1",
            "balloon":{
                "drop":true,
                "adjustBorderColor":false,
                "color":"#ffffff"
            },
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 5,
            "hideBulletsCount": 50,
            "lineThickness": 2,
            "title": "red line",
            "useLineColorForBulletBorder": true,
            "valueField": "value",
            "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
        }],
        "chartScrollbar": {
            "graph": "g1",
            "oppositeAxis":false,
            "offset":30,
            "scrollbarHeight": 80,
            "backgroundAlpha": 0,
            "selectedBackgroundAlpha": 0.1,
            "selectedBackgroundColor": "#888888",
            "graphFillAlpha": 0,
            "graphLineAlpha": 0.5,
            "selectedGraphFillAlpha": 0,
            "selectedGraphLineAlpha": 1,
            "autoGridCount":true,
            "color":"#AAAAAA"
        },
        "chartCursor": {
            "pan": true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true,
            "cursorAlpha":1,
            "cursorColor":"#258cbb",
            "limitToGraph":"g1",
            "valueLineAlpha":0.2,
            "valueZoomable":true
        },
        "valueScrollbar":{
            "oppositeAxis":false,
            "offset":50,
            "scrollbarHeight":10
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "dashLength": 1,
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true
        },
        "dataProvider": [{
            "date": "2012-07-27",
            "value": 13
        }, {
            "date": "2012-07-28",
            "value": 11
        }, {
            "date": "2012-07-29",
            "value": 15
        }, {
            "date": "2012-07-30",
            "value": 16
        }, {
            "date": "2012-07-31",
            "value": 18
        }, {
            "date": "2012-08-01",
            "value": 13
        }, {
            "date": "2012-08-02",
            "value": 22
        }, {
            "date": "2012-08-03",
            "value": 23
        }, {
            "date": "2012-08-04",
            "value": 20
        }, {
            "date": "2012-08-05",
            "value": 17
        }, {
            "date": "2012-08-06",
            "value": 16
        }, {
            "date": "2012-08-07",
            "value": 18
        }, {
            "date": "2012-08-08",
            "value": 21
        }, {
            "date": "2012-08-09",
            "value": 26
        }, {
            "date": "2012-08-10",
            "value": 24
        }, {
            "date": "2012-08-11",
            "value": 29
        }, {
            "date": "2012-08-12",
            "value": 32
        }, {
            "date": "2012-08-13",
            "value": 18
        }, {
            "date": "2012-08-14",
            "value": 24
        }, {
            "date": "2012-08-15",
            "value": 22
        }, {
            "date": "2012-08-16",
            "value": 18
        }, {
            "date": "2012-08-17",
            "value": 19
        }, {
            "date": "2012-08-18",
            "value": 14
        }, {
            "date": "2012-08-19",
            "value": 15
        }, {
            "date": "2012-08-20",
            "value": 12
        }, {
            "date": "2012-08-21",
            "value": 8
        }, {
            "date": "2012-08-22",
            "value": 9
        }, {
            "date": "2012-08-23",
            "value": 8
        }, {
            "date": "2012-08-24",
            "value": 7
        }, {
            "date": "2012-08-25",
            "value": 5
        }, {
            "date": "2012-08-26",
            "value": 11
        }, {
            "date": "2012-08-27",
            "value": 13
        }, {
            "date": "2012-08-28",
            "value": 18
        }, {
            "date": "2012-08-29",
            "value": 20
        }, {
            "date": "2012-08-30",
            "value": 29
        }, {
            "date": "2012-08-31",
            "value": 33
        }, {
            "date": "2012-09-01",
            "value": 42
        }, {
            "date": "2012-09-02",
            "value": 35
        }, {
            "date": "2012-09-03",
            "value": 31
        }, {
            "date": "2012-09-04",
            "value": 47
        }, {
            "date": "2012-09-05",
            "value": 52
        }, {
            "date": "2012-09-06",
            "value": 46
        }, {
            "date": "2012-09-07",
            "value": 41
        }, {
            "date": "2012-09-08",
            "value": 43
        }, {
            "date": "2012-09-09",
            "value": 40
        }, {
            "date": "2012-09-10",
            "value": 39
        }, {
            "date": "2012-09-11",
            "value": 34
        }, {
            "date": "2012-09-12",
            "value": 29
        }, {
            "date": "2012-09-13",
            "value": 34
        }, {
            "date": "2012-09-14",
            "value": 37
        }, {
            "date": "2012-09-15",
            "value": 42
        }, {
            "date": "2012-09-16",
            "value": 49
        }, {
            "date": "2012-09-17",
            "value": 46
        }, {
            "date": "2012-09-18",
            "value": 47
        }, {
            "date": "2012-09-19",
            "value": 55
        }, {
            "date": "2012-09-20",
            "value": 59
        }, {
            "date": "2012-09-21",
            "value": 58
        }, {
            "date": "2012-09-22",
            "value": 57
        }, {
            "date": "2012-09-23",
            "value": 61
        }, {
            "date": "2012-09-24",
            "value": 59
        }, {
            "date": "2012-09-25",
            "value": 67
        }, {
            "date": "2012-09-26",
            "value": 65
        }, {
            "date": "2012-09-27",
            "value": 61
        }, {
            "date": "2012-09-28",
            "value": 66
        }, {
            "date": "2012-09-29",
            "value": 69
        }, {
            "date": "2012-09-30",
            "value": 71
        }, {
            "date": "2012-10-01",
            "value": 67
        }, {
            "date": "2012-10-02",
            "value": 63
        }, {
            "date": "2012-10-03",
            "value": 46
        }, {
            "date": "2012-10-04",
            "value": 32
        }, {
            "date": "2012-10-05",
            "value": 21
        }, {
            "date": "2012-10-06",
            "value": 18
        }, {
            "date": "2012-10-07",
            "value": 21
        }, {
            "date": "2012-10-08",
            "value": 28
        }, {
            "date": "2012-10-09",
            "value": 27
        }, {
            "date": "2012-10-10",
            "value": 36
        }, {
            "date": "2012-10-11",
            "value": 33
        }, {
            "date": "2012-10-12",
            "value": 31
        }, {
            "date": "2012-10-13",
            "value": 30
        }, {
            "date": "2012-10-14",
            "value": 34
        }, {
            "date": "2012-10-15",
            "value": 38
        }, {
            "date": "2012-10-16",
            "value": 37
        }, {
            "date": "2012-10-17",
            "value": 44
        }, {
            "date": "2012-10-18",
            "value": 49
        }, {
            "date": "2012-10-19",
            "value": 53
        }, {
            "date": "2012-10-20",
            "value": 57
        }, {
            "date": "2012-10-21",
            "value": 60
        }, {
            "date": "2012-10-22",
            "value": 61
        }, {
            "date": "2012-10-23",
            "value": 69
        }, {
            "date": "2012-10-24",
            "value": 67
        }, {
            "date": "2012-10-25",
            "value": 72
        }, {
            "date": "2012-10-26",
            "value": 77
        }, {
            "date": "2012-10-27",
            "value": 75
        }, {
            "date": "2012-10-28",
            "value": 70
        }, {
            "date": "2012-10-29",
            "value": 72
        }, {
            "date": "2012-10-30",
            "value": 70
        }, {
            "date": "2012-10-31",
            "value": 72
        }, {
            "date": "2012-11-01",
            "value": 73
        }, {
            "date": "2012-11-02",
            "value": 67
        }, {
            "date": "2012-11-03",
            "value": 68
        }, {
            "date": "2012-11-04",
            "value": 65
        }, {
            "date": "2012-11-05",
            "value": 71
        }, {
            "date": "2012-11-06",
            "value": 75
        }, {
            "date": "2012-11-07",
            "value": 74
        }, {
            "date": "2012-11-08",
            "value": 71
        }, {
            "date": "2012-11-09",
            "value": 76
        }, {
            "date": "2012-11-10",
            "value": 77
        }, {
            "date": "2012-11-11",
            "value": 81
        }, {
            "date": "2012-11-12",
            "value": 83
        }, {
            "date": "2012-11-13",
            "value": 80
        }, {
            "date": "2012-11-14",
            "value": 81
        }, {
            "date": "2012-11-15",
            "value": 87
        }, {
            "date": "2012-11-16",
            "value": 82
        }, {
            "date": "2012-11-17",
            "value": 86
        }, {
            "date": "2012-11-18",
            "value": 80
        }, {
            "date": "2012-11-19",
            "value": 87
        }, {
            "date": "2012-11-20",
            "value": 83
        }, {
            "date": "2012-11-21",
            "value": 85
        }, {
            "date": "2012-11-22",
            "value": 84
        }, {
            "date": "2012-11-23",
            "value": 82
        }, {
            "date": "2012-11-24",
            "value": 73
        }, {
            "date": "2012-11-25",
            "value": 71
        }, {
            "date": "2012-11-26",
            "value": 75
        }, {
            "date": "2012-11-27",
            "value": 79
        }, {
            "date": "2012-11-28",
            "value": 70
        }, {
            "date": "2012-11-29",
            "value": 73
        }, {
            "date": "2012-11-30",
            "value": 61
        }, {
            "date": "2012-12-01",
            "value": 62
        }, {
            "date": "2012-12-02",
            "value": 66
        }, {
            "date": "2012-12-03",
            "value": 65
        }, {
            "date": "2012-12-04",
            "value": 73
        }, {
            "date": "2012-12-05",
            "value": 79
        }, {
            "date": "2012-12-06",
            "value": 78
        }, {
            "date": "2012-12-07",
            "value": 78
        }, {
            "date": "2012-12-08",
            "value": 78
        }, {
            "date": "2012-12-09",
            "value": 74
        }, {
            "date": "2012-12-10",
            "value": 73
        }, {
            "date": "2012-12-11",
            "value": 75
        }, {
            "date": "2012-12-12",
            "value": 70
        }, {
            "date": "2012-12-13",
            "value": 77
        }, {
            "date": "2012-12-14",
            "value": 67
        }, {
            "date": "2012-12-15",
            "value": 62
        }, {
            "date": "2012-12-16",
            "value": 64
        }, {
            "date": "2012-12-17",
            "value": 61
        }, {
            "date": "2012-12-18",
            "value": 59
        }, {
            "date": "2012-12-19",
            "value": 53
        }, {
            "date": "2012-12-20",
            "value": 54
        }, {
            "date": "2012-12-21",
            "value": 56
        }, {
            "date": "2012-12-22",
            "value": 59
        }, {
            "date": "2012-12-23",
            "value": 58
        }, {
            "date": "2012-12-24",
            "value": 55
        }, {
            "date": "2012-12-25",
            "value": 52
        }, {
            "date": "2012-12-26",
            "value": 54
        }, {
            "date": "2012-12-27",
            "value": 50
        }, {
            "date": "2012-12-28",
            "value": 50
        }, {
            "date": "2012-12-29",
            "value": 51
        }, {
            "date": "2012-12-30",
            "value": 52
        }, {
            "date": "2012-12-31",
            "value": 58
        }, {
            "date": "2013-01-01",
            "value": 60
        }, {
            "date": "2013-01-02",
            "value": 67
        }, {
            "date": "2013-01-03",
            "value": 64
        }, {
            "date": "2013-01-04",
            "value": 66
        }, {
            "date": "2013-01-05",
            "value": 60
        }, {
            "date": "2013-01-06",
            "value": 63
        }, {
            "date": "2013-01-07",
            "value": 61
        }, {
            "date": "2013-01-08",
            "value": 60
        }, {
            "date": "2013-01-09",
            "value": 65
        }, {
            "date": "2013-01-10",
            "value": 75
        }, {
            "date": "2013-01-11",
            "value": 77
        }, {
            "date": "2013-01-12",
            "value": 78
        }, {
            "date": "2013-01-13",
            "value": 70
        }, {
            "date": "2013-01-14",
            "value": 70
        }, {
            "date": "2013-01-15",
            "value": 73
        }, {
            "date": "2013-01-16",
            "value": 71
        }, {
            "date": "2013-01-17",
            "value": 74
        }, {
            "date": "2013-01-18",
            "value": 78
        }, {
            "date": "2013-01-19",
            "value": 85
        }, {
            "date": "2013-01-20",
            "value": 82
        }, {
            "date": "2013-01-21",
            "value": 83
        }, {
            "date": "2013-01-22",
            "value": 88
        }, {
            "date": "2013-01-23",
            "value": 85
        }, {
            "date": "2013-01-24",
            "value": 85
        }, {
            "date": "2013-01-25",
            "value": 80
        }, {
            "date": "2013-01-26",
            "value": 87
        }, {
            "date": "2013-01-27",
            "value": 84
        }, {
            "date": "2013-01-28",
            "value": 83
        }, {
            "date": "2013-01-29",
            "value": 84
        }, {
            "date": "2013-01-30",
            "value": 81
        }]
    });

    chart.addListener("rendered", zoomChart);

    zoomChart();

    
});

function zoomChart() {
    chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
}



