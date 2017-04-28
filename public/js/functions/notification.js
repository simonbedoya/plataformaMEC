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
    showLoadNotification(true);
    loadNotification(email);
    loadNumberNotification(email);
}

function loadNotification(email) {
    clearDataNotification();
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
                setDataNotification(null);
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

function clearDataNotification() {
    $('#tableNotification').find('> tbody').empty();
}

function setDataNotification(data) {
    clearDataNotification();
    if(data === null){
        $('#tableNotification').find('> tbody').append(`<tr><td colspan="4">No existen notificaciones..</td></tr>`);
        return;
    }

        let d;
        for(d in data) {
            let date = new Date(data[d].REGISTER_NOTIFICATION);
            let hour = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true});
            let fecha;
            if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
                fecha = hour;
            } else {
                fecha = date.toLocaleDateString("es-CO", {month: "short", day: "2-digit"});
            }
            let type;
            switch (data[d].TYPE_NOTIFICATION) {
                case "FILE":
                    type = "text-success";
                    break;
                case "EVENT":
                    type = "text-danger";
                    break;
                case "ERROR":
                    type = "text-warning";
                    break;
                case "ALERT":
                    type = "text-info";
                    break;
                case "STATUS":
                    type = "text-purple";
                    break;
            }
            let read = "active";
            if (data[d].READ_NOTIFICATION) {
                read = "";
            }
            $('#tableNotification').find('> tbody').append(
                `<tr class="${read}" id="noti_${data[d].PK_NOTIFICATION}">` +
                `<td class="mail-select">` +
                `<label class="cr-styled">` +
                `<input type="checkbox" id="chck_noti_${data[d].PK_NOTIFICATION}" onchange="selectedItemNoti('${data[d].PK_NOTIFICATION}')"><i class="fa"></i>` +
                `</label>` +
                `</td>` +
                `<td>` +
                `<p href="">${data[d].NAME_SENSOR}</p>` +
                `</td>` +
                `<td>` +
                `<a href=""><i class="fa fa-circle ${type} m-r-15"></i>${data[d].TITLE_NOTIFICATION}</a>` +
                `</td>` +
                `<td class="text-right">${fecha}</td>` +
                `</tr>`
            );
        }
    showLoadNotification(false);
}

function loadNumberNotification(email) {
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getNumberNotification",
        data: {email: email},
        success: function (result) {
            if (result.code === "001") {
                setNumberNotification(result.data);
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
                setNumberNotification(null);
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

function setNumberNotification(data) {
    let number = document.getElementById('numberNotification');
    if(data === null){
        number.innerHTML = `Mostrando 0 - 0 de 0`;
        return;
    }

    if(data.N_NOTI < 10){
        number.innerHTML = `Mostrando 1 - ${data.N_NOTI} de ${data.N_NOTI}`;
    }else {
        number.innerHTML = `Mostrando 1 - 10 de ${data.N_NOTI}`;
    }
}

function loadDataNotificationByTag(email,type) {
    showLoadNotification(true);
    $.ajax({
        type: "post",
        url: "https://plataformamec.com/data/getNotificationByTag",
        data: {email: email, type: type},
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
                setDataNotification(null);
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

function showLoadNotification(show) {
    if(show){
        if(!$('#loadingNotification').hasClass('hidden')){
            $('#loadingNotification').addClass('hidden');
        }
    }else{
        if(!$('#loadingNotification').hasClass('hidden')){
            $('#loadingNotification').removeClass('hidden');
        }
    }
}

function showPanelLoad(id,show) {
    let portlet = $(`#${id}`);
    if(show) {
        portlet.append('<div class="panel-disabled"><div class="loader-1"></div></div>');
    }else{
        let pd = portlet.find('.panel-disabled');
        pd.fadeOut('fast', function () {
            pd.remove();
        });
    }

}

