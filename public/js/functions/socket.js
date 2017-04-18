/**
 * Created by sbv23 on 14/04/2017.
 */
let socket = io('https://socket.plataformamec.com');
//let socket = io('http://localhost:4000');


socket.on("connect", function (data) {
    console.log(data);
    let user = document.getElementById("email_user").innerHTML;
    socket.emit('register_web',`{"email": "${user}"}`, function (confirm) {
        if(confirm){
            $.Notification.autoHideNotify('black', 'top right', 'Alerta...','Estas conectado con tus sensores para recibir alertas en tiempo real.');
        }else{
            $.Notification.autoHideNotify('black', 'top right', 'Alerta...','No se ha podido establecer conexion con tus sensores.');
        }
    });
});

socket.on("showError", function (data) {
    console.log(data);
    let dataIn = JSON.parse(data);
    $.Notification.autoHideNotify('error', 'top right', `Error con ${dataIn.component}`, dataIn.msg);
});

socket.on("uploadFile",function (data) {
    console.log(data);
    let dataIn = JSON.parse(data);
    let msg, title;
    if(dataIn.type === "FILE"){
        title = "Carga de archivos!";
        msg = `Se han subido nuevos archivos relacionados con el sensor ${dataIn.name_sensor}`;
    }else{
        title = "Notificación eventos!";
        msg = `Se ha registrado un nuevo evento relacionado con el sensor ${dataIn.name_sensor}`;
    }
    $.Notification.autoHideNotify('info', 'top right', title, msg);
});

socket.on("dataGraph", function (data) {
    console.log(data);
   /*let gData = { BHZ: 10};

    graph.series.addData(gData);
    graph.update();*/
    chart.dataProvider.shift();

    // add new one at the end
    day = day + 1;
    var newDate = new Date( firstDate );
    console.log(newDate.getMilliseconds() + day);
    newDate.setDate( newDate.getDate() + day );
    var visits = Math.round( Math.random() * 40 ) - 20;
    console.log(newDate.getTime());

    chart.dataProvider.push( {
        date: newDate,
        visits: visits
    } );
    chart.validateData();
});

socket.on("testResponse", function (data) {
   console.log(data);
   let dataIn = JSON.parse(data);

   document.getElementById(`resultTest${dataIn.component}`).innerHTML += dataIn.data;
   document.getElementById(`resultTest${dataIn.component}`).innerHTML += "\n";



   if(dataIn.last){
       terminateTest(dataIn.component);
   }
});


function terminateTest(component) {
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/terminateTest",
        data: {pk_sensor: pk_sensor, type: component},
        success: function (result) {
            if(result.code === "001"){
                document.getElementById(`resultTest${component}`).innerHTML += "Ha terminado test...";
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}





