/**
 * Created by sbv23 on 28/12/2016.
 */
let tableDateList;
let graph;
let data = [];
let ymax;
let ymin;
const maxTotalSamples = 170000;
let maxSamples;
let durationFile;
let timeGraphic;
let durationFileFinal;
let totalSamplesFile;
let axis;
let dateFile;
let hourFile;



function displayGrphicRT() {
    document.getElementById('btndrt').style.display = 'none';
    document.getElementById('graphicRT').classList.remove('hidden');
}

$('#close_grt').click(function () {
    document.getElementById('graphicRT').classList.add('hidden');
    document.getElementById('btndrt').style.display = 'block';
});

function load(dateList,serial,email) {
    reloadNumberNoReadNotification(email);

    let dateListFull = [];
    let i;
    for(i in dateList){
        if(i !== "empty"){
            let date = dateList[i].DATE_FILE.split("T");
            let dateA = {DATE_FILE: date[0], N_FILES: dateList[i].N_FILES};
            dateListFull.push(dateA);
        }
    }
    tableDateList = $('#tableDateList').DataTable({
        "data": dateListFull,
        "ordering": false,
        "info": false,
        "searching": true,
        "pageLength": true,
        "scrollY":        "575px",
        "scrollCollapse": true,
        "paging":         false,
        "pagingType": "numbers",
        "dom": 'frtip',
        "columns" : [{
            "className": 'details-control',
            "orderable": false,
            "data": null,
            "defaultContent": ''
        }, {"data": "DATE_FILE"},{"data": "N_FILES"}]
    });

    $('#tableDateList tbody').on('click', 'td.details-control', function () {
        let tr = $(this).closest('tr');
        let row = tableDateList.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            getDateList(row.data().DATE_FILE,serial,row);

            tr.addClass('shown');
        }
    } );


}

function format (data) {
    // `d` is the original data object for the row
    let fila = "";
    fila += "<table class='col-lg-10' cellspacing='0' border='0' style='margin-left:30px;'>" +
        "<thead>" +
            "<tr>" +
                "<th>Hora</th>"+
                "<th>Eje</th>"+
                "<th>Fecha Registro</th>"+
                "<th>Acciones</th>"+
            "</tr>"+
        "</thead>"+
        "<tbody>";
    let i;
    for(i in data){
        let regDate = datetime(data[i].REGISTERDATE_FILE);
        //let reg_date = data[i].REGISTERDATE_FILE.split("T");
        //let reg_hour = reg_date[1].split(".");
        fila += `<tr>`+
                    `<td>${data[i].HOUR_FILE}</td>`+
                    `<td>${data[i].AXIS_FILE}</td>`+
                    `<td>${regDate}</td>`+
                    `<td>`+
                        `<a onclick="readFile(${data[i].PK_FILE},'${data[i].HOUR_FILE}','${data[i].AXIS_FILE}')" data-toggle='tooltip' data-placement='bottom' title='Ver'><i class="ion-eye"></i></a>`+
                    `</td>`+
                `</tr>`;
    }
    fila += "</tbody></table>";

    return fila;
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


function getDateList(date,serial,row) {
    showPanelLoad('portListDates',true);
    let axis = $('#filterAxis').val();
    let data;
    if(axis === "BH1, BH2, BHZ"){
        data = {serial: serial, date: date};
    }else{
        data = {serial: serial, date: date, axis: axis};
    }
    $.ajax({
        type: "post",
        async: false,
        url: "https://plataformamec.com/data/getDateList",
        data: data,
        success: function (result) {
            showPanelLoad('portListDates',false);
            if (result.code === "001"){
                //hay datos
                row.child(format(result.data)).show();
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
                getDateList(serial,date);
            });
        }
    });
}

function readFile(pk_file,hour,axis) {

    //socket.emit('sendPkFile', pk_file);
    showPanelLoad('portListDates',true);
    showPanel('panelFile',false);
    showPanel('btnShowParamGraphic',true);
    showPanel('panelGraphic',false);
    showPanel('graphicGenerateFile',false);
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getDataFileByPk",
        data: {pk_file: pk_file},
        success: function (result) {
            showPanelLoad('portListDates',false);

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
                clearDataFile();
                setDataFile(date_file[0],hour,axis,samplesec,parseInt(samples[1]),duration);
                clearDataGenerateGraphic();
                //console.log(data);
                /*if(graph === undefined) {
                 graph = new Rickshaw.Graph({
                 element: document.querySelector("#chartPcpal"),
                 height: 250,
                 renderer: 'line',
                 series: [{
                 color: 'steelblue',
                 data: data,

                 }]
                 });

                 let x_axis = new Rickshaw.Graph.Axis.Time({graph: graph});

                 let y_axis = new Rickshaw.Graph.Axis.Y({
                 graph: graph,
                 orientation: 'left',
                 tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                 element: document.getElementById('y_axis'),
                 });



                 document.getElementById("y_axis").setAttribute("style", "margin-left: -40px;");
                 }else{
                 graph.series[0].data = data;

                 }
                 let max = parseFloat(ymax[1]);
                 let min = parseFloat(ymin[1]);
                 graph.max = max + (max * 0.05);
                 graph.min = min - (min * 0.05);
                 graph.render();*/
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

function setDataFile(date,hour,axis_i,samplessec,sample,duration) {
    maxSamples = samplessec;
    durationFile = duration;
    totalSamplesFile = sample;
    axis = axis_i;
    dateFile = date;
    hourFile = hour;
    document.getElementById("dfDate").innerHTML = date;
    document.getElementById("dfHour").innerHTML = hour;
    document.getElementById("dfAxis").innerHTML = axis_i;
    document.getElementById("dfSamSec").innerHTML = `${samplessec} sps`;
    document.getElementById("dfSam").innerHTML = `${sample} sam`;
    document.getElementById("dfDuration").innerHTML = `${duration} min` ;
    showPanel('panelFile',true);
}

function clearDataFile() {
    document.getElementById("dfDate").innerHTML = "";
    document.getElementById("dfHour").innerHTML = "";
    document.getElementById("dfAxis").innerHTML = "";
    document.getElementById("dfSamSec").innerHTML = "";
    document.getElementById("dfSam").innerHTML = "";
    document.getElementById("dfDuration").innerHTML = "";
}

function clearDataGenerateGraphic() {
    document.getElementById("samInp").value = "1";
    $('#stepsam').val(1);
    document.getElementById("timeGraphic").innerHTML = `${durationFile} min`;
    document.getElementById("minIT").value = "0";
    $('#stepminIT').val(1);
    document.getElementById("secIT").value = "0";
    $('#stepsecIT').val(1);
    document.getElementById("minTF").value = "0";
    $('#stepminTF').val(1);
    document.getElementById("secTF").value = "0";
    $('#stepsecTF').val(1);
}

/*socket.on('connect', function(){

});*/

function reloadDataTable(serial) {
    showPanelLoad('portListDates',true);
    let axis = $('#filterAxis').val();
    let data;
    if(axis === "BH1, BH2, BHZ"){
        data = {serial: serial};
    }else{
        data = {serial: serial, axis: axis};
    }
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getDates",
        data: data,
        success: function (result) {
            showPanelLoad('portListDates',false);
            if (result.code === "001"){
                //hay datos
                let dateListFull = [];
                let i;
                for(i in result.data){
                    let date = result.data[i].DATE_FILE.split("T");
                    let dateA = {DATE_FILE: date[0], N_FILES: result.data[i].N_FILES};
                    dateListFull.push(dateA);
                }
                tableDateList.clear().draw();
                tableDateList.rows.add(dateListFull);
                tableDateList.columns.adjust().draw();

            }else if(result.code === "002"){
                tableDateList.clear().draw();
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
                reloadDataTable(serial);
            });
        }
    });
}

function count(move, id, step){
    let input = $(`#${id}`);
    let stepval = parseInt($(`#${step}`).val());
    let field = parseInt(input.val());
    if(move === "u"){
        field = field + stepval;
        if (field > 60){
            field =  60;
        }
    }else if(move === "d"){
        field = field - stepval;
        if(field < 0){
            field = 0;
        }
    }
    input.val(field.toString());
}

function finalTime(move, id, step) {
    let input = $(`#${id}`);
    let stepval = parseInt($(`#${step}`).val());
    let field = parseInt(input.val());

    if(move === "u"){
        field = field + stepval;

        if (field > 60){
            field =  60;
        }
    }else if(move === "d"){
        field = field - stepval;
        if(field < 0){
            field = 0;
        }
    }
    input.val(field.toString());
    let differTime = difTime();
    let timeComparate;
    if(timeGraphic === undefined){
        timeGraphic = durationFile;
    }
    if(timeGraphic > durationFile){
        timeComparate = durationFile;
    }else{
        timeComparate = timeGraphic;
    }
    if(differTime > timeComparate){
        swal({
            title: "Información",
            text: `El tiempo maximo para generar grafica es de ${durationFileFinal} minutos!`,
            type: "info",
            showCancelButton: false,
            confirmButtonColor: "#444a53",
            confirmButtonText: "OK"
        }).then(function () {
            document.getElementById("minTF").value = 0;
            document.getElementById("secTF").value = 0;
        });
    }

}

function difTime() {
    let minIT = parseInt($('#minIT').val());
    let secIT = parseInt($('#secIT').val());
    let minFT = parseInt($('#minTF').val());
    let secFT = parseInt($('#secTF').val());
    let minutes = minFT - minIT;
    let seconds = secFT - secIT;
    return minutes + (seconds / 60);

}

function samples(move, id, step){
    let input = $(`#${id}`);
    let stepval = parseInt($(`#${step}`).val());
    let field = parseInt(input.val());
    if(move === "u"){
        field = field + stepval;
        if (field > maxSamples){
            field =  maxSamples;
        }
    }else if(move === "d"){
        field = field - stepval;
        if(field < 1){
            field = 1;
        }
    }
    input.val(field.toString());
    calculateTimeMax(field);
}

function calculateTimeMax(field) {
    let samplesGraphic = parseInt($('#samInp').val());

    timeGraphic = parseInt((maxTotalSamples / samplesGraphic) / 60);
    if(field !== 1) {
        if (timeGraphic > durationFile) {
            durationFileFinal = durationFile;
            document.getElementById("timeGraphic").innerHTML = `${durationFile} min`;
        } else {
            durationFileFinal = timeGraphic;
            document.getElementById("timeGraphic").innerHTML = `${timeGraphic} min`;
        }
    }else{
        durationFileFinal = durationFile;
        document.getElementById("timeGraphic").innerHTML = `${durationFile} min`;
    }

}

function showPanel(id,show) {
    if(show){
        $(`#${id}`).removeClass("hidden");
    }else{
        $(`#${id}`).addClass("hidden");
    }
}

function loadParamGraphic(){
    document.getElementById("timeGraphic").innerHTML = `${durationFile} min`;
    showPanel('panelGraphic',true);
    showPanel('btnShowParamGraphic',false);
    clearDataGenerateGraphic();
}

function closePanelGraphic(){
    showPanel('panelGraphic',false);
    showPanel('btnShowParamGraphic',true);
    showPanel('graphicGenerateFile',false);
    clearDataGenerateGraphic();
}

function generateGraphic() {
    showPanel('graphicGenerateFile',true);
    showPanelLoad('portletGraphic',true);
    let timeTotalGraphic;
    if(timeGraphic === undefined){
        timeGraphic = durationFile;
    }
    if(timeGraphic > durationFile){
        timeTotalGraphic = durationFile;
    }else{
        timeTotalGraphic = timeGraphic;
    }

    let minIT = parseInt($('#minIT').val());
    let secIT = parseInt($('#secIT').val());
    let minFT = parseInt($('#minTF').val());
    let secFT = parseInt($('#secTF').val());

    let dataNew = [];

    let samples = parseInt($('#samInp').val());
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

    if((minIT === 0) && (secIT === 0)){
             //si tiempo incial igual a cero
             if((minFT === 0) && (secFT === 0)){
                 //si ambos tiempos son igual a cero se grafica total de tiempo desde 0 como inicial
                 if(samples === maxSamples){
                     console.log("Muestras iguales");
                     if(totalSamplesFile > maxTotalSamples) {
                         for (let i = 0; i < maxTotalSamples; i = i + interJump) {
                             dataNew.push(data[i]);
                         }
                     }else{
                         for (let i = 0; i < totalSamplesFile; i = i + interJump) {
                             dataNew.push(data[i]);
                         }
                     }
                 }else{
                     console.log("Muestras diferentes");
                     //let timeX = 1 / samples;
                     //let j = 0;
                     let dataN = [];
                     for(let i=0; i< data.length ; i = i + interJump){
                         //let dataN = {x: (timeX * j), y:data[i].y};
                         dataN.push(data[i]);
                         //j++;
                     }
                     if(dataN.length > maxTotalSamples) {
                         for (let i = 0; i < maxTotalSamples; i++) {
                             dataNew.push(dataN[i]);
                         }
                     }else{
                         for (let i = 0; i < dataN.length; i++) {
                             dataNew.push(dataN[i]);
                         }
                     }
                 }
             }else{
                 //graficar desde tiempo inicial 0 a  tiempo final establecido
                 let totalTime = minFT + ( secFT / 60);
                 if(totalTime > durationFile){
                     swal({
                         title: "Información",
                         text: `El tiempo maximo para generar la grafica es ${durationFile} minutos!`,
                         type: "info",
                         showCancelButton: false,
                         confirmButtonColor: "#444a53",
                         confirmButtonText: "OK"
                     }).then(function () {

                     });
                 }else{
                     let dataN = [];
                     for(let i=0; i< data.length ; i = i + interJump){
                         //let dataN = {x: (timeX * j), y:data[i].y};
                         dataN.push(data[i]);
                         //j++;
                     }
                     for(let i=0; i<dataN.length; i++){
                         dataNew.push(dataN[i]);
                         if(dataN[i].x >= totalTime * 60){
                             break;
                         }
                     }
                 }
             }
         }else{
             //si tiempo incial diferente de cero
             if((minFT === 0) && (secFT === 0)){
                 //si tiempo inciial diferente a 0 y tiempo final igual a 0 graficar desde tiempo establecido hasta tiempo posible
                 let dataN = [];
                 for(let i=0; i< data.length ; i = i + interJump){
                     //let dataN = {x: (timeX * j), y:data[i].y};
                     dataN.push(data[i]);
                     //j++;
                 }
                 for(let i=0; i<dataN.length; i++){
                     if(dataN[i].x >= ((minIT * 60)+secIT)){
                         dataNew.push(dataN[i]);
                         if(dataN[i].x >= (durationFileFinal*60 + ((minIT*60)+secIT))){
                             break;
                         }
                     }
                 }
             }else{
                 //si ambos son diferentes de 0 graficar el rango de valores

                 let timeInicial = (minIT + (secIT / 60));
                 let timeFinal =  (minFT + (secFT / 60));
                 if((timeInicial > timeFinal)||(timeInicial === timeFinal)){
                     //error mensaje
                     swal({
                         title: "Información",
                         text: `Recuerde que el tiempo inicial no debe ser mayor que el tiempo final y el tiempo inicial no debe ser igual a tiempo final!`,
                         type: "info",
                         showCancelButton: false,
                         confirmButtonColor: "#444a53",
                         confirmButtonText: "OK"
                     }).then(function () {

                     });
                 }else{
                     let dataN = [];
                     for(let i=0; i< data.length ; i = i + interJump){
                         //let dataN = {x: (timeX * j), y:data[i].y};
                         dataN.push(data[i]);
                         //j++;
                     }
                     for(let i=0; i<dataN.length; i++){
                         if(dataN[i].x >= ((minIT * 60)+secIT)){
                             dataNew.push(dataN[i]);
                             if(dataN[i].x >= ((minFT * 60) + secFT)){
                                 break;
                             }
                         }
                     }
                 }
             }
         }


    drawGraphic(dataNew);
}


let chart;
let day = 0;
let chartData = [];

function drawGraphic(dataNew) {


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
            "dataProvider": getdata(dataNew),
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

        showPanelLoad('portletGraphic',false);
    }
}

function getdata(dataNew) {
    let chartData = [];
    let arrayDate = dateFile.split("-");
    let hourarray = hourFile.split(":");
    dataNew.forEach((i) => {
        let date = new Date(arrayDate[0],arrayDate[1],arrayDate[2]);
        date.setHours(parseInt(hourarray[0]), 0, 1, 0);
        let minutes = parseInt(i.x / 60);
        let seconds = parseInt(i.x % 60);
        let milisec = parseInt(((i.x % 60) - parseInt(i.x %60)) * 1000);
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