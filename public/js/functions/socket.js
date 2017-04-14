/**
 * Created by sbv23 on 14/04/2017.
 */
let socket = io('https://socket.plataformamec.com');


socket.on("connection_success", function (data) {
    console.log(data);
    //socket.emit('register','{"serial": "'+serial+'"}');
});

socket.on("register_success", function (data) {
    console.log(data);
});

