/**
 * Created by sbv23 on 09/12/2016.
 */
function closeAlert() {
    let alert = $('#alertError');
    if(alert.is(':visible')){
        document.getElementById('alertError').style.display = 'none';
    }
}
