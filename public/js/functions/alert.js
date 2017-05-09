/**
 * Created by sbv23 on 01/05/2017.
 */

function load(email,networks) {
    reloadNumberNoReadNotification(email);
    loadNetwork(networks);
}

function loadNetwork(data) {
    let i;
    for(i = 0; i < data.length; i++) {
        document.getElementById("filterNetwork").innerHTML += "<option value='" + data[i].PK_NETWORK + "'>"+data[i].NAME_NETWORK+"</option>";
    }
}