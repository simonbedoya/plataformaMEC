/**
 * Created by sbv23 on 01/05/2017.
 */
let sensors;

function load(email,networks,sensorsList) {
    sensors = sensorsList;
    reloadNumberNoReadNotification(email);
    loadNetwork(networks);
    loadSensor(sensorsList);
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
    if(selectNet === 0){
        loadSensor(sensors);
    }else{
        let sensorAux = [];
        let i;
        for(i = 0; i < sensors.length; i++) {
            if(sensors[i].PK_NETWORK === selectNet){
                sensorAux.push(sensors[i]);
            }
        }
        loadSensor(sensorAux);
    }
}