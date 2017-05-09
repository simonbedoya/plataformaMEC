/**
 * Created by sbv23 on 01/05/2017.
 */
let sensors;
let tableEventsList;

function load(email,networks,sensorsList,events) {
    sensors = sensorsList;
    reloadNumberNoReadNotification(email);
    loadNetwork(networks);
    loadSensor(sensorsList);
    loadEvents(events);
}

function loadNetwork(data) {
    let i;
    for(i = 0; i < data.length; i++) {
        document.getElementById("filterNetwork").innerHTML += "<option value='" + data[i].PK_NETWORK + "'>"+data[i].NAME_NETWORK+"</option>";
    }
}

function loadSensor(data){
    let i;
    document.getElementById("filterSensor").innerHTML = "<option value='0'>-</option>";
    for(i = 0; i < data.length; i++) {
        document.getElementById("filterSensor").innerHTML += `<option value='${data[i].PK_SENSOR}'>${data[i].NAME_SENSOR}</option>`;
    }
}

function selectNetwork() {
    let selectNet = $('#filterNetwork').val();
    if(selectNet === '0'){
        loadSensor(sensors);
    }else{
        let sensorAux = [];
        let i;
        for(i = 0; i < sensors.length; i++) {
            if(sensors[i].PK_NETWORK.toString() === selectNet){
                sensorAux.push(sensors[i]);
            }
        }
        loadSensor(sensorAux);
    }
}

function loadEvents(dataList) {
    let dateListFull = [];
    let i;
    for(i in dataList){
        if(i !== "empty"){
            let date = dataList[i].DATE_FILE.split("T");
            let option = `<a onclick="readFile(${dataList[i].PK_FILE},'${dataList[i].HOUR_FILE}','${dataList[i].AXIS_FILE}')" data-toggle='tooltip' data-placement='bottom' title='Ver'><i class="ion-eye"></i></a>`+
                         `<a href="/data/downloadFile?id=${dataList[i].PK_FILE}" class="m-l-15" data-toggle='tooltip' data-placement='bottom' title='Descargar'><i class="ion-ios7-cloud-download"></i></a>`;
            let dateA = {DATE: date[0], HOUR: dataList[i].HOUR_FILE, AXIS: dataList[i].AXIS_FILE, NAME: dataList[i].NAME_SENSOR, OPTION: option};
            dateListFull.push(dateA);
        }
    }

    tableEventsList = $('#tableEventList').DataTable({
        "data": dateListFull,
        "ordering": false,
        "info": false,
        "searching": true,
        "lengthMenu": [[10, 20], [10, 25]],
        "pagingType": "numbers",
        "columns" : [{"data": "DATE"},{"data": "HOUR"},{"data": "AXIS"},{"data": "NAME"},{"data": "OPTION"}]
    });
}