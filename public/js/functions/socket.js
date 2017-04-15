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


socket.on("testResponse", function (data) {
   console.log(data);
   let dataIn = JSON.parse(data);
   switch (dataIn.type){
       case "GPS":
           document.getElementById("resultTestGPS").innerHTML += dataIn.data;
           break;

   }
});





