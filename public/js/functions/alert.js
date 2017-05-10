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
    loadEvents(events, false);
}

function loadNetwork(data) {
    if(data !== 0) {
        let i;
        for (i = 0; i < data.length; i++) {
            document.getElementById("filterNetwork").innerHTML += "<option value='" + data[i].PK_NETWORK + "'>" + data[i].NAME_NETWORK + "</option>";
        }
    }
}

function loadSensor(data){
    if(data !== 0) {
        let i;
        document.getElementById("filterSensor").innerHTML = "<option value='0'>-</option>";
        for (i = 0; i < data.length; i++) {
            document.getElementById("filterSensor").innerHTML += `<option value='${data[i].PK_SENSOR}'>${data[i].NAME_SENSOR}</option>`;
        }
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

function loadEvents(dataList,n) {
    let dateListFull = [];
    let i;
    for(i in dataList){
        if(i !== "empty"){
            let date = dataList[i].DATE_FILE.split("T");
            let option = `<a onclick="readFile(${dataList[i].PK_FILE},'${dataList[i].AXIS_FILE}','${dataList[i].HOUR_FILE}')" data-toggle='tooltip' data-placement='bottom' title='Ver'><i class="ion-eye"></i></a>`+
                         `<a href="/data/downloadFile?id=${dataList[i].PK_FILE}" class="m-l-15" data-toggle='tooltip' data-placement='bottom' title='Descargar'><i class="ion-ios7-cloud-download"></i></a>`;
            let dateA = {DATE: date[0], HOUR: dataList[i].HOUR_FILE, AXIS: dataList[i].AXIS_FILE, NAME: dataList[i].NAME_SENSOR, OPTION: option};
            dateListFull.push(dateA);
        }
    }

    if(!n) {
        tableEventsList = $('#tableEventList').DataTable({
            "data": dateListFull,
            "ordering": false,
            "info": false,
            "searching": true,
            "lengthMenu": [[10, 20], [10, 25]],
            "pagingType": "numbers",
            "columns": [{"data": "DATE"}, {"data": "HOUR"}, {"data": "AXIS"}, {"data": "NAME"}, {"data": "OPTION"}]
        });
    }else{
        showPanelLoad('portListEvents',false);
        tableEventsList.rows.add(dateListFull).draw();
    }
}

function readFile(pk_file,axis, hourFile) {
    let data = [];

    showPanelLoad('portListEvents',true);
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getDataFileByPk",
        data: {pk_file: pk_file},
        success: function (result) {
            if(result.code === "001") {
                let date_file = result.msg.split("T");
                let resultArray = result.data.split("\n");

                let delta = resultArray[0].split(" : ");
                let time = parseFloat(delta[1]);
                let samplesec = parseInt(1/time);
                let samples = resultArray[3].split(" : ");
                let duration = parseInt((time * parseInt(samples[1])) / 60);
                ymax = resultArray[1].split(" : ");
                ymin = resultArray[2].split(" : ");
                for (let i = 4; i < resultArray.length - 1; i++) {
                    let arrAux = resultArray[i].split(" = ");
                    let arrCom = {x: time * (i - 4), y: parseFloat(arrAux[1])};
                    data.push(arrCom);
                }
                loadSamplesDialog(samplesec, data, axis, date_file[0], hourFile);
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
                readFile(pk_file);
            });
        }
    });
}

function loadSamplesDialog(samples, data, axis, date_file, hourFile) {
    let arraySamples;
    if(samples === 40){
        arraySamples =  {'1': '1','2': '2','4': '4','5': '5','8': '8','10': '10','20': '20','40': '40'};
    }else if(samples === 50){
        arraySamples =  {'1': '1','2': '2','5': '5','10': '10','50': '50'};
    }else if(samples === 100){
        arraySamples =  {'1': '1','2': '2','4': '4','5': '5','10': '10','20': '20','25': '25','50': '50','100': '100'};
    }else if(samples === 200){
        arraySamples =  {'1': '1','2': '2','4': '4','5': '5','10': '10','20': '20','25': '25','50': '50','100': '100','200': '200'};
    }
    showPanelLoad('portListEvents',false);
    swal({
        title: 'Seleccione',
        text: 'Tasa de muestreo para generar la grafica.',
        input: 'select',
        inputOptions: arraySamples,
        inputPlaceholder: 'Muestras por segundo',
        showCancelButton: true
    }).then(function (result) {
        //alert(result);
        generateGraphic(result, samples, data, axis, date_file, hourFile);
    },function (dismiss) {
        
    })
}

function generateGraphic(samples, maxSamples, data, axis, date_file, hourFile) {

    let dataNew = [];
    //let samples = parseInt($('#samInp').val());
    let interJump = parseInt(maxSamples / samples);

    if((maxSamples % samples) !== 0){
        swal({
            title: "Información",
            text: `El numero de muestras no es exacto, se realizara la grafica con un muestreo igual a ${parseInt(maxSamples / interJump)} sps!`,
            type: "info",
            showCancelButton: false,
            confirmButtonColor: "#444a53",
            confirmButtonText: "OK"
        }).then(function () {

        });
    }

    for (let i = 0; i < data.length; i = i + interJump) {
        dataNew.push(data[i]);
    }
    drawGraphic(dataNew, axis, date_file, hourFile);
}

let chart;

function drawGraphic(dataNew, axis, date_file, hourFile) {

    if(dataNew.length === 0){
        swal({
            title: "Información",
            text: `Ha seleccionado un rango de tiempo fuera del los datos del archivo!`,
            type: "info",
            showCancelButton: false,
            confirmButtonColor: "#444a53",
            confirmButtonText: "OK"
        }).then(function () {

        });
    }else{
        let valueAxes = [{'axisAlpha': 0.2,'id': 'g1'}];
        let graphs = [{
            "id": "g1",
            "valueField": axis,
            "bullet": "round",
            "balloonText": `${axis} : [[value]]`,
            "title": axis,
            "bulletBorderColor": "#FFFFFF",
            "bulletBorderThickness": 2,
            "lineThickness": 2,
            "lineColor": "#08088A",
            "negativeLineColor": "#08088A",
            "hideBulletsCount": 50
        }];

        chart = AmCharts.makeChart( "chartdiv", {
            "type": "serial",
            "theme": "light",
            "language": "es",
            "zoomOutButton": {
                "backgroundColor": '#000000',
                "backgroundAlpha": 0.15
            },
            "dataProvider": getdata(dataNew, date_file, hourFile, axis),
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
        showPanel('graphicGenerateFile',true);
    }
}

function getdata(dataNew, dateFile, hourFile, axis) {
    let chartData = [];
    let arrayDate = dateFile.split("-");
    let hourarray = hourFile.split(":");
    dataNew.forEach((i) => {
        let date = new Date(arrayDate[0],arrayDate[1],arrayDate[2]);
        date.setHours(parseInt(hourarray[0]), 0, 1, 0);
        let minutes = parseInt(i.x / 60) + parseInt(hourarray[1]);
        let seconds = parseInt(i.x % 60) + parseInt(hourarray[2]);
        let milisec = parseInt(((i.x % 60) - seconds) * 1000);
        date.setMinutes(minutes);
        if(i.x !== 0) {
            date.setSeconds(seconds);
            date.setMilliseconds(milisec);
        }
        let dataFinale;
        switch (axis){
            case "BH1":
                dataFinale = {
                    "date": date,
                    "BH1": i.y,
                };
                break;
            case "BH2":
                dataFinale = {
                    "date": date,
                    "BH2": i.y,
                };
                break;
            case "BHZ":
                dataFinale = {
                    "date": date,
                    "BHZ": i.y,
                };
                break;
        }

        chartData.push(dataFinale);
    });
    return chartData;
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

function showPanel(id,show) {
    if(show){
        $(`#${id}`).removeClass("hidden");
    }else{
        $(`#${id}`).addClass("hidden");
    }
}

function filter() {
    let axis = $('#filterAxis').val();
    let idNetwork = $('#filterNetwork').val();
    let idSensor = $('#filterSensor').val();
    let startDate = $('#startDate').val();
    let finalDate = $('#finalDate').val();

    showPanelLoad('portListEvents',true);
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getEventsByFilter",
        data: {axis: axis, idNetwork: idNetwork, idSensor: idSensor, startDate: startDate, finalDate: finalDate},
        success: function (result) {
            if(result.code === "001") {
                loadEvents(result.data, true);
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
                filter();
            });
        }
    });

}



