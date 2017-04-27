/**
 * Created by sbv23 on 27/04/2017.
 */
function selectedItemNoti(id) {
   if($(`#noti_${id}`).hasClass("selectedItem")){
       $(`#noti_${id}`).removeClass("selectedItem");
   }else{
       $(`#noti_${id}`).addClass("selectedItem");
   }
}

function load(email) {
    loadNotification(email);
}

function loadNotification(email) {
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getNotificationByUser",
        data: {email: email},
        success: function (result) {
            if (result.code === "001") {
                setDataNotification(result.data);
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
function setDataNotification(data) {
    if(data !== null){
        let d;
        for(d in data){
            let date = data[d].REGISTER_NOTIFICATION.split("T");
            let hour = date[1].split(".");
            let dateA = new Date();
            let fecha;
            if(date[0] === dateA.toISOString()){
                fecha = date[1];
            }else{
                fecha = date[0];
            }
            $('#tableNotification').find('> tbody').append(
                `<tr class="" id="noti_${data[d].PK_NOTIFICATION}">`+
                    `<td class="mail-select">`+
                        `<label class="cr-styled">`+
                            `<input type="checkbox" id="chck_noti_${data[d].PK_NOTIFICATION}" onchange="selectedItemNoti('${data[d].PK_NOTIFICATION}')"><i class="fa"></i>`+
                        `</label>`+
                    `</td>`+
                    `<td>`+
                        `<p href="">${data[d].NAME_SENSOR}</p>`+
                    `</td>`+
                    `<td>`+
                        `<a href=""><i class="fa fa-circle text-info m-r-15"></i>${data[d].TITLE_NOTIFICATION}</a>`+
                    `</td>`+
                    `<td class="text-right">${fecha}</td>`+
                `</tr>`
            );
        }
    }
}

