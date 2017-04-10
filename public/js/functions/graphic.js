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
const timeGraphicMax = 3600;
let durationFile;
let timeGraphic;
//let socket = io('http://52.34.55.59:3000');


function displayGrphicRT() {
    document.getElementById('btndrt').style.display = 'none';
    document.getElementById('graphicRT').classList.remove('hidden');
}

$('#close_grt').click(function () {
    document.getElementById('graphicRT').classList.add('hidden');
    document.getElementById('btndrt').style.display = 'block';
});

function load(dateList,serial) {

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
        let reg_date = data[i].REGISTERDATE_FILE.split("T");
        let reg_hour = reg_date[1].split(".");
        fila += `<tr>`+
                    `<td>${data[i].HOUR_FILE}</td>`+
                    `<td>${data[i].AXIS_FILE}</td>`+
                    `<td>${reg_date[0]} - ${reg_hour[0]}</td>`+
                    `<td>`+
                        `<a onclick="readFile(${data[i].PK_FILE},'${data[i].HOUR_FILE}','${data[i].AXIS_FILE}')" data-toggle='tooltip' data-placement='bottom' title='Ver'><i class="ion-eye"></i></a>`+
                    `</td>`+
                `</tr>`;
    }
    fila += "</tbody></table>";

    return fila;
}

function showPanelLoad(show) {
    let portlet = $('#portListDates');
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
    showPanelLoad(true);
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
        url: "http://52.34.55.59:3000/data/getDateList",
        data: data,
        success: function (result) {
            showPanelLoad(false);
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
    showPanelLoad(true);
    showPanel('panelFile',false);
    showPanel('btnShowParamGraphic',true);
    showPanel('panelGraphic',false);
    $.ajax({
        type: "post",
        url: "http://52.34.55.59:3000/data/getDataFileByPk",
        data: {pk_file: pk_file},
        success: function (result) {
            showPanelLoad(false);

            if(result.code === "001") {
                let date_file = result.msg.split("T");
                let resultArray = result.data.split("\n");

                let delta = resultArray[0].split(" : ");
                let time = parseFloat(delta[1]);
                let samplesec = parseInt(1/time);
                let samples = resultArray[3].split(" : ");
                let duration = (time * parseInt(samples[1])) / 60;
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

function setDataFile(date,hour,axis,samplessec,sample,duration) {
    maxSamples = samplessec;
    durationFile = duration;
    document.getElementById("dfDate").innerHTML = date;
    document.getElementById("dfHour").innerHTML = hour;
    document.getElementById("dfAxis").innerHTML = axis;
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
    showPanelLoad(true);
    let axis = $('#filterAxis').val();
    let data;
    if(axis === "BH1, BH2, BHZ"){
        data = {serial: serial};
    }else{
        data = {serial: serial, axis: axis};
    }
    $.ajax({
        type: "post",
        url: "http://52.34.55.59:3000/data/getDates",
        data: data,
        success: function (result) {
            showPanelLoad(false);
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
            text: "El tiempo maximo para generar grafica es el que se muestra en tiempo maximo grafica en la parte tasa de muestreo!",
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
            document.getElementById("timeGraphic").innerHTML = `${durationFile} min`;
        } else {
            document.getElementById("timeGraphic").innerHTML = `${timeGraphic} min`;
        }
    }else{
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
    clearDataGenerateGraphic();
}

function generateGraphic() {
    showPanel('graphicGenerateFile',true);
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
    if((maxSamples % samples) === 0){
         if((minIT === 0) && (secIT === 0)){
             //si tiempo incial igual a cero
             if((minFT === 0) && (secFT === 0)){
                 //si ambos tiempos son igual a cero se grafica total de tiempo desde 0 como inicial
                 if(samples === maxSamples){
                     for(let i=0; i< maxTotalSamples; i = i + interJump){
                         dataNew.push(data[i]);
                     }
                 }else{
                     let timeX = 1 / samples;
                     let j = 0;
                     for(let i=0; i< maxTotalSamples; i = i + interJump){
                         let dataN = {x: (timeX * j), y:data[i].y};
                         dataNew.push(dataN);
                         j++;
                     }
                 }
             }else{
                 //graficar desde tiempo inicial 0 a  tiempo final establecido

             }
         }else{
             //si tiempo incial diferente de cero
             if((minFT === 0) && (secFT === 0)){
                 //si tiempo inciial diferente a 0 y tiempo final igual a 0 graficar desde 0 hasta tiempo posible

             }else{
                 //si ambos son diferentes de 0 graficar el rango de valores

             }
         }
    }else{
        swal({
            title: "Información",
            text: `El numero de muestras no es exacto, se realizara la grafica con un muestreo igual a ${maxTotalSamples / interJump} sps!`,
            type: "info",
            showCancelButton: false,
            confirmButtonColor: "#444a53",
            confirmButtonText: "OK"
        }).then(function () {

        });
    }


    drawGraphic(dataNew);
}

function drawGraphic(dataNew) {
    if(graph === undefined) {
        graph = new Rickshaw.Graph({
            element: document.querySelector("#chartPcpal"),
            height: 250,
            renderer: 'line',
            series: [{
                color: 'steelblue',
                data: dataNew,

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
        graph.series[0].data = dataNew;

    }
    let max = parseFloat(ymax[1]);
    let min = parseFloat(ymin[1]);
    graph.max = max + (max * 0.05);
    graph.min = min - (min * 0.05);
    graph.render();
}