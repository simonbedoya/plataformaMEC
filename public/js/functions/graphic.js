/**
 * Created by sbv23 on 28/12/2016.
 */
let tableDateList;
let graph;

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
        "scrollY":        "250px",
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
                "<th>Fecha Registro</th>"+
                "<th>Acciones</th>"+
            "</tr>"+
        "</thead>"+
        "<tbody>";
    let i;
    for(i in data){
        let reg_date = data[i].REGISTERDATE_FILE.split("T");
        let reg_hour = reg_date[1].split(".");
        fila += `<tr><td>${data[i].HOUR_FILE}</td><td>${reg_date[0]} - ${reg_hour[0]}</td><td><a onclick="readFile(${data[i].PK_FILE})" data-toggle='tooltip' data-placement='bottom' title='Ver'><i class="ion-eye"></i></a></td></tr>`;
    }
    fila += "</tbody></table>";

    return fila;
}


function getDateList(date,serial,row) {
    $.ajax({
        type: "post",
        async: false,
        url: "http://52.34.55.59:3000/data/getDateList",
        data: {serial: serial, date: date},
        success: function (result) {
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
    $.ajax({
        type: "post",
        async: false,
        url: "http://52.34.55.59:3000/data/getDataFileByPk",
        data: {pk_file: pk_file},
        success: function (result) {
            let resultArray = result.split("\n");
            let data = [];
            for(let i = 4; i < resultArray.length-1; i++){
                let arrAux = resultArray[i].split(" = ");
                let time = 1 / 100;
                let arrCom = {x: time*(i-4), y: parseInt(arrAux[1])};
                data.push(arrCom);
            }
            //console.log(data);

            $.plot($("linePlot"),
                [ { data: data,
                    label: "x",
                    color: '#3bc0c3'
                }],
                {
                    series: {
                        lines: {
                            show: true,
                            fill: true,
                            lineWidth: 1,
                            fillColor: {
                                colors: [ { opacity: 0.5 },
                                    { opacity: 0.5 }
                                ]
                            }
                        },
                        points: {
                            show: true
                        },
                        shadowSize: 0
                    },
                    legend: {
                        position: 'nw'
                    },
                    grid: {
                        hoverable: true,
                        clickable: true,
                        borderColor: '#efefef',
                        borderWidth: 1,
                        labelMargin: 10,
                        backgroundColor: '#fff'
                    },
                    yaxis: {
                        min: 0,
                        max: 15,
                        color: 'rgba(0,0,0,0.1)'
                    },
                    xaxis: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: '%s: Value of %x is %y',
                        shifts: {
                            x: -60,
                            y: 25
                        },
                        defaultTheme: false
                    }
                });
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

function reloadDataTable(serial) {
    $.ajax({
        type: "post",
        url: "http://52.34.55.59:3000/data/getDates",
        data: {serial: serial},
        success: function (result) {
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