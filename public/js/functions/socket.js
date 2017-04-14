/**
 * Created by sbv23 on 14/04/2017.
 */
let socket = io('https://socket.plataformamec.com');
//let socket = io('http://localhost:4000');


socket.on("connect", function (data) {
    console.log(data);
    let user = document.getElementById("email_user").innerHTML;
    alert(user);
    socket.emit('register_web',`{"email": "${user}"}`, function (confirm) {
        if(confirm){
            alert("registro exitoso");
        }else{
            alert("error");
        }
    });
});

socket.on("register_success", function (data) {
    console.log(data);
});



