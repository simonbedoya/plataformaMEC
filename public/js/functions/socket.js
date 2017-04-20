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

socket.on("responseRealTime", function (data) {
    console.log(data);

    chart.dataProvider.shift();
    
    //let data =  { "z":[4901021,4684524,4696664,4821436,4742526,4884834,4865275,4874043,4652151,4805250,4695314,4901695,4664291,4723642,4719596,4852461,4900346,4797831,4812668,4834251,4905742,4915858,4652151,4600893,4857856,3842143,4599544,4860554,4774900,4983978,4669687,4790411,4836274,4695990,5017025,4839646,4999489,4644057,4632591,4710828,4817390,4696664,4940812,4981280,4905067,4602242,4874718,4983978,4801877,4671035] };
    let dataIn = data.data;
    let dataN = [];
    let dataNew = [];
    let size = [];
    let ejes = [];
    for(let i in dataIn){
        size.push(dataIn[i].length);
        ejes.push(i);
    }
    for(let i=0; i<size[0]; i++){
        if(ejes.length === 3){
            dataN = {
                date: new Date(),
                BH1: dataIn[ejes[0]][i],
                BH2: dataIn[ejes[1]][i],
                BHZ: dataIn[ejes[2]][i]
            }
        }
        dataNew.push(dataN);
    }
    console.log(dataNew);

    chart.dataProvider.push(dataNew);
    chart.validateData();
    /*let gData = { BHZ: 10};

    graph.series.addData(gData);
    graph.update();*/
    //chart.dataProvider.shift();

    // add new one at the end
    /*mili = mili + 100;
    var newDate = new Date( firstDate );
    console.log(newDate.getMilliseconds());
    newDate.setMilliseconds( newDate.getMilliseconds() + 60000 + mili);
    var BH1 = Math.round( Math.random() * 40 ) - 20;
    var BH2 = Math.round( Math.random() * 20 ) - 10;
    var BHZ = Math.round( Math.random() * 30 ) - 40;
    console.log(newDate.getTime());

    chart.dataProvider.push( {
        date: newDate,
        BH1: BH1,
        BH2: BH2,
        BHZ: BHZ
    } );
    chart.validateData();*/
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





