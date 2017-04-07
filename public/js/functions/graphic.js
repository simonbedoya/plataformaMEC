/**
 * Created by sbv23 on 28/12/2016.
 */
let tableDateList;
let graph;
let socket = io('http://52.34.55.59:3000');


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
        "scrollY":        "220px",
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

    document.getElementById('graphicRT').classList.add('hidden');
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
                        `<a onclick="readFile(${data[i].PK_FILE})" data-toggle='tooltip' data-placement='bottom' title='Ver'><i class="ion-eye"></i></a>`+
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

function readFile(pk_file) {
    //socket.emit('sendPkFile', pk_file);
    $.ajax({
        type: "post",
        async: false,
        url: "http://52.34.55.59:3000/data/getDataFileByPk",
        data: {pk_file: pk_file},
        success: function (result) {
            let resultArray = result.split("\n");
            let data = [];
            let delta = resultArray[0].split(" : ");
            let time = parseFloat(delta[1]);
            let ymax = resultArray[1].split(" : ");
            let ymin = resultArray[2].split(" : ");
            for(let i = 4; i < resultArray.length-1; i++){
                let arrAux = resultArray[i].split(" = ");
                let arrCom = {x:time*(i-4), y:parseFloat(arrAux[1])};
                data.push(arrCom);
            }
            //console.log(data);
            if(graph === undefined) {
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
            graph.render();

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

socket.on('connect', function(){

});

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

function count(move, id){
    let input = $(`#${id}`);
    let field = parseInt(input.val());
    if(move === "u"){
        if (field !== 60){
            field = field + 1;
        }
    }else{
        if(field !== 0){
            field = field - 1;
        }
    }
    input.val(input.toString());
}