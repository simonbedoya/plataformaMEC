/**
 * Created by sbv23 on 26/03/2017.
 */
module.exports = {
    query_validateRegister: "SELECT PK_SENSOR FROM TBL_SENSOR WHERE SERIAL_SENSOR = '${serial}' AND STATUS_SENSOR = 'Activo'",
    query_insertSensor: "INSERT INTO TBL_SENSOR (SERIAL_SENSOR, PK_NETWORK, NAME_SENSOR, STATUS_SENSOR, REGISTERDATE_SENSOR, UPDATEDATE_SENSOR) VALUES ('${serial}', ${network}, '${name}', 'Activo', '${date1}', '${date2}')",
    query_updateSensor: "UPDATE TBL_SENSOR SET STATUS_SENSOR = 'Inactivo', UPDATEDATE_SENSOR = ${date} WHERE PK_SENSOR = ${pk_sensor}",
    query_verifyUploadPath: "SELECT count(*) AS counter FROM TBL_LOCATION WHERE UPLOADPATH_LOCATION = '${uploadPath}'",
    query_verifyRegisterLocation: "SELECT count(*) AS counter FROM TBL_LOCATION WHERE PK_SENSOR = ${pk_sensor}",
    query_getUploadPathNetwork: "SELECT UPLOADPATH_NETWORK FROM TBL_SENSOR INNER JOIN TBL_NETWORK ON TBL_SENSOR.PK_NETWORK = TBL_NETWORK.PK_NETWORK WHERE PK_SENSOR = ${pk_sensor}",
    query_insertLocation: "INSERT INTO TBL_LOCATION (PK_SENSOR, LAT_LOCATION, LNG_LOCATION, ALT_LOCATION, ADDRESS_LOCATION, REGISTERDATE_LOCATION, UPDATEDATE_LOCATION, UPLOADPATH_LOCATION) VALUES (${pk_sensor},'${lat}','${lng}','${alt}','${address}','${date1}','${date2}','${uploadpath}')"
};