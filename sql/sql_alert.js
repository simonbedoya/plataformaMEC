/**
 * Created by sbv23 on 9/05/2017.
 */
module.exports = {
    getNetowrkByUser: "SELECT PK_NETWORK, NAME_NETWORK FROM TBL_NETWORK WHERE EMAIL_USER = '${email}'",
    getSensorByUser: "SELECT tbs.PK_SENSOR, tbs.NAME_SENSOR, tbn.PK_NETWORK FROM TBL_SENSOR tbs INNER JOIN TBL_NETWORK tbn ON tbs.PK_NETWORK = tbn.PK_NETWORK WHERE tbn.EMAIL_USER = '${email}' AND tbs.STATUS_SENSOR = 'Activo'",
    getListEventByUser: "SELECT tbf.DATE_FILE, tbf.HOUR_FILE, tbf.AXIS_FILE, tbf.PK_FILE, tbs.NAME_SENSOR FROM TBL_FILE tbf INNER JOIN TBL_LOCATION tbl ON tbf.PK_LOCATION = tbl.PK_LOCATION AND tbl.STATUS_LOCATION = 'Activa' INNER JOIN TBL_SENSOR tbs ON tbl.PK_SENSOR = tbs.PK_SENSOR INNER JOIN TBL_NETWORK tbn ON tbs.PK_NETWORK = tbn.PK_NETWORK WHERE tbn.EMAIL_USER = '${email}' AND tbf.DATE_FILE = CURDATE() AND tbf.TYPE_FILE = 'EVENT'"
};