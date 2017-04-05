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
    query_insertLocation: "INSERT INTO TBL_LOCATION (PK_SENSOR, LAT_LOCATION, LNG_LOCATION, ALT_LOCATION, ADDRESS_LOCATION, REGISTERDATE_LOCATION, UPDATEDATE_LOCATION, UPLOADPATH_LOCATION) VALUES (${pk_sensor},'${lat}','${lng}','${alt}','${address}','${date1}','${date2}','${uploadpath}')",
    query_insertFile: "INSERT INTO TBL_FILE (PK_SENSOR, PATH_FILE, DATE_FILE, HOUR_FILE, REGISTERDATE_FILE, PK_LOCATION, AXIS_FILE) VALUES (${pk_sensor},'${path_file}', '${date}', '${hour}', '${reg_date}', ${pk_location},'${axis}')",
    query_verifyExistFile: "SELECT count(tbf.PK_FILE) AS counter, (SELECT tbl.UPLOADPATH_LOCATION FROM TBL_LOCATION tbl WHERE tbl.PK_SENSOR = ${pk_sensor} AND tbl.STATUS_LOCATION = 'Activa') as UPLOADPATH, (SELECT tbl2.PK_LOCATION FROM TBL_LOCATION tbl2 WHERE tbl2.PK_SENSOR = ${pk_sensor} AND tbl2.STATUS_LOCATION = 'Activa') as PK_LOCATION FROM TBL_FILE tbf WHERE tbf.PK_SENSOR = ${pk_sensor} AND tbf.DATE_FILE = '${date}' AND tbf.HOUR_FILE = '${hour}' AND tbf.AXIS_FILE = '${axis}'",
    query_updateFile: "UPDATE TBL_FILE SET PATH_FILE = '${path_file}', REGISTERDATE_FILE = '${reg_date}' WHERE PK_SENSOR = ${pk_sensor} AND DATE_FILE = '${date}' AND HOUR_FILE = '${hour}' AND AXIS_FILE = '${axis}'",
    query_updateLocations: "UPDATE TBL_LOCATION SET STATUS_LOCATION = 'Inactiva', UPDATEDATE_LOCATION = '${date}' WHERE PK_SENSOR = ${pk_sensor}"
};