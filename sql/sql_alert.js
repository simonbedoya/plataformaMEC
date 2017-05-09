/**
 * Created by sbv23 on 9/05/2017.
 */
module.exports = {
    getNetowrkByUser: "SELECT PK_NETWORK, NAME_NETWORK FROM TBL_NETWORK WHERE EMAIL_USER = '${email}'",
    getSensorByUser: "SELECT tbs.PK_SENSOR, tbs.NAME_SENSOR FROM TBL_SENSOR tbs INNER JOIN TBL_NETWORK tbn ON tbs.PK_NETWORK = tbn.PK_NETWORK WHERE tbn.EMAIL_USER = '${email}' AND tbs.STATUS_SENSOR = 'Activo'"
};