/**
 * Created by sbv23 on 28/12/2016.
 */
function displayGrphicRT() {
    document.getElementById('btndrt').style.display = 'none';
    document.getElementById('graphicRT').classList.remove('hidden');
}

$('#close_grt').click(function () {
    document.getElementById('graphicRT').classList.add('hidden');
    document.getElementById('btndrt').style.display = 'block';
});

function load() {
    document.getElementById('graphicRT').classList.add('hidden');
}