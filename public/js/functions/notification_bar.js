/**
 * Created by sbv23 on 28/04/2017.
 */
let emailP;
function loadNumberNoReadNotification(email){
    emailP = email;
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getNotificationNoRead",
        data: {email: email},
        success: function (result) {
            if (result.code === "001") {
                if(result.data.N_NOTI === 0){
                    document.getElementById("numberNotificationsNoRead").innerHTML = "0";
                }else {
                    document.getElementById("numberNotificationsNoRead").innerHTML = `(${result.data.N_NOTI})`;
                }
            } else if (result.code === "003") {
                swal({
                    title: "Información",
                    text: "Ha ocurrido un error intenta de nuevo!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#444a53",
                    confirmButtonText: "OK"
                }).then(function () {

                });
            } else if(result.code === "002"){
                document.getElementById("numberNoRead").innerHTML = "0";
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

            });
        }
    });
}

$(document).ready(function()
{
    setInterval(function(){ loadNumberNoReadNotification(emailP); }, 10000);
});
