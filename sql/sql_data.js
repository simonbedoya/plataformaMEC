/**
 * Created by sbv23 on 21/03/2017.
 */
'use strict';

module.exports = {
    query_location: "SELECT LAT_LOCATION, LNG_LOCATION, ADDRESS_NETWORK, NAME_SENSOR, SERIAL_SENSOR, REGISTERDATE_SENSOR, NAME_NETWORK FROM TBL_LOCATION INNER JOIN TBL_SENSOR ON TBL_LOCATION.PK_SENSOR = TBL_SENSOR.PK_SENSOR AND STATUS_LOCATION = 'Activa' INNER JOIN TBL_NETWORK ON TBL_SENSOR.PK_NETWORK = TBL_NETWORK.PK_NETWORK WHERE EMAIL_USER = '${email}' AND STATUS_SENSOR = 'Activo'",
    query_networks: "SELECT * FROM TBL_NETWORK WHERE EMAIL_USER = '${email}'",
    query_countSensors: "SELECT count(*) AS SENSORS FROM TBL_SENSOR WHERE PK_NETWORK = '${network}' AND STATUS_SENSOR = 'Activo'",
    query_updateNetwork: "UPDATE TBL_NETWORK SET NAME_NETWORK = '${name}', ADDRESS_NETWORK = '${address}', STATUS_NETWORK = '${status}', UPDATEDATE_NETWORK = '${date}' WHERE PK_NETWORK = ${network}",
    query_sensors: "SELECT * FROM TBL_NETWORK INNER JOIN TBL_SENSOR ON TBL_NETWORK.PK_NETWORK = TBL_SENSOR.PK_NETWORK WHERE EMAIL_USER = '${email}' AND STATUS_SENSOR = 'Activo'",
    query_updateNameSensor: "UPDATE TBL_SENSOR SET NAME_SENSOR = '${name}' WHERE PK_SENSOR='${pk_sensor}'",
    query_sensorByNetwork1: "SELECT * FROM TBL_NETWORK INNER JOIN TBL_SENSOR ON TBL_NETWORK.PK_NETWORK = TBL_SENSOR.PK_NETWORK WHERE TBL_NETWORK.PK_NETWORK = ${pk_network} AND STATUS_SENSOR = 'Activo'",
    query_sensorByNetwork2: "SELECT * FROM TBL_NETWORK INNER JOIN TBL_SENSOR ON TBL_NETWORK.PK_NETWORK = TBL_SENSOR.PK_NETWORK WHERE EMAIL_USER = '${user}' AND STATUS_SENSOR = 'Activo'",
    query_insertNetwork: "INSERT INTO TBL_NETWORK (PK_USER, EMAIL_USER, NAME_NETWORK, ADDRESS_NETWORK, STATUS_NETWORK, CREATEDDATE_NETWORK, UPDATEDATE_NETWORK, UPLOADPATH_NETWORK) VALUES (${pk_user},'${user}','${name}','${address}','${status}','${date1}','${date2}','${uploadPath}')",
    query_verifyUploadPath: "SELECT count(*) AS counter FROM TBL_NETWORK WHERE UPLOADPATH_NETWORK = '${uploadPath}'",
    query_getUploadPathNetwork: "SELECT UPLOADPATH_NETWORK FROM TBL_NETWORK WHERE PK_NETWORK = ${network}",
    query_deleteNetwork: "DELETE FROM TBL_NETWORK WHERE PK_NETWORK = ${network}",
    query_getLocationByPkSensor: "SELECT LAT_LOCATION, LNG_LOCATION, ADDRESS_NETWORK, NAME_SENSOR, SERIAL_SENSOR, REGISTERDATE_SENSOR, NAME_NETWORK FROM TBL_LOCATION INNER JOIN TBL_SENSOR ON TBL_LOCATION.PK_SENSOR = TBL_SENSOR.PK_SENSOR INNER JOIN TBL_NETWORK ON TBL_SENSOR.PK_NETWORK = TBL_NETWORK.PK_NETWORK WHERE TBL_SENSOR.PK_SENSOR = '${pk_sensor}' AND STATUS_SENSOR = 'Activo' AND TBL_LOCATION.STATUS_LOCATION = 'Activa'",
    query_getInfoSensor: "SELECT SERIAL_SENSOR, NAME_SENSOR, STATUS_SENSOR, REGISTERDATE_SENSOR, UPDATEDATE_SENSOR FROM TBL_SENSOR WHERE PK_SENSOR = ${pk_sensor}",
    query_getLocationSensor: "SELECT LAT_LOCATION, LNG_LOCATION, ALT_LOCATION, ADDRESS_LOCATION FROM TBL_LOCATION INNER JOIN TBL_SENSOR ON TBL_LOCATION.PK_SENSOR = TBL_SENSOR.PK_SENSOR WHERE TBL_SENSOR.PK_SENSOR = ${pk_sensor} AND STATUS_SENSOR = 'Activo'",
    query_getNetworkSensor: "SELECT SSID_WIFI, IPADR_WIFI, MACADR_WIFI FROM TBL_WIFI WHERE PK_SENSOR = ${pk_sensor}",
    query_getCountEventSensor: "SELECT (SELECT count(*) FROM TBL_EVENTS ev WHERE ev.PK_SENSOR = ${pk_sensor}  AND ev.PK_TYPEEVENT = 1) as countLTA, count(*) as countSTA FROM TBL_EVENTS evt WHERE evt.PK_SENSOR = ${pk_sensor} AND evt.PK_TYPEEVENT = 2",
    query_getStatusComponentSensor: "SELECT (SELECT bt.STATUS_BATTERY FROM TBL_BATTERY bt WHERE bt.PK_SENSOR = ${pk_sensor}) AS STA_BATT, (SELECT rtc.STATUS_RTC FROM TBL_RTC rtc WHERE rtc.PK_SENSOR = ${pk_sensor}) AS STA_RTC, (SELECT acc.STATUS_ACCELEROMETER FROM TBL_ACCELEROMETER acc WHERE acc.PK_SENSOR = ${pk_sensor}) AS STA_ACC, (SELECT adc.STATUS_ADC FROM TBL_ADC adc WHERE adc.PK_SENSOR = ${pk_sensor}) AS STA_ADC, (SELECT gps.STATUS_GPS FROM TBL_GPS gps WHERE gps.PK_SENSOR = ${pk_sensor}) AS STA_GPS, (SELECT cp.STATUS_CPU FROM TBL_CPU cp WHERE cp.PK_SENSOR = ${pk_sensor}) AS STA_CPU, wifi.STATUS_WIFI AS STA_WIFI FROM TBL_WIFI wifi WHERE wifi.PK_SENSOR = ${pk_sensor}",
    query_dateList: "SELECT TBF.PK_FILE, TBF.HOUR_FILE, TBF.REGISTERDATE_FILE, TBF.AXIS_FILE FROM TBL_SENSOR TBS INNER JOIN TBL_LOCATION TBL ON TBS.PK_SENSOR = TBL.PK_SENSOR AND TBL.STATUS_LOCATION = 'Activa' INNER JOIN TBL_FILE TBF ON TBL.PK_LOCATION = TBF.PK_LOCATION WHERE TBS.SERIAL_SENSOR = '${serial}' AND TBF.DATE_FILE = '${date}' AND TBF.TYPE_FILE = 'FILE' ORDER BY TBF.HOUR_FILE ASC",
    query_dateListFilter: "SELECT TBF.PK_FILE, TBF.HOUR_FILE, TBF.REGISTERDATE_FILE, TBF.AXIS_FILE FROM TBL_SENSOR TBS INNER JOIN TBL_LOCATION TBL ON TBS.PK_SENSOR = TBL.PK_SENSOR AND TBL.STATUS_LOCATION = 'Activa' INNER JOIN TBL_FILE TBF ON TBL.PK_LOCATION = TBF.PK_LOCATION WHERE TBS.SERIAL_SENSOR = '${serial}' AND TBF.DATE_FILE = '${date}' AND TBF.AXIS_FILE = '${axis}' AND TBF.TYPE_FILE = 'FILE' ORDER BY TBF.HOUR_FILE ASC",
    query_dates: "SELECT tbf.DATE_FILE, count(tbf.PATH_FILE) AS N_FILES FROM TBL_SENSOR tbs INNER JOIN TBL_LOCATION tbl ON tbl.PK_SENSOR = tbs.PK_SENSOR AND tbl.STATUS_LOCATION = 'Activa' INNER JOIN TBL_FILE tbf ON tbl.PK_LOCATION = tbf.PK_LOCATION WHERE tbs.SERIAL_SENSOR = '${serial}' AND tbf.TYPE_FILE = 'FILE' GROUP BY tbf.DATE_FILE",
    query_datesfilter: "SELECT tbf.DATE_FILE, count(tbf.PATH_FILE) AS N_FILES FROM TBL_SENSOR tbs INNER JOIN TBL_LOCATION tbl ON tbl.PK_SENSOR = tbs.PK_SENSOR AND tbl.STATUS_LOCATION = 'Activa' INNER JOIN TBL_FILE tbf ON tbl.PK_LOCATION = tbf.PK_LOCATION WHERE tbs.SERIAL_SENSOR = '${serial}' AND tbf.AXIS_FILE = '${axis}' AND tbf.TYPE_FILE = 'FILE' GROUP BY tbf.DATE_FILE",
    query_getDataFileByPk: "SELECT PATH_FILE, DATE_FILE FROM TBL_FILE WHERE PK_FILE = ${pk_file}",
    query_login: "SELECT count(*) AS counter FROM TBL_USER WHERE EMAIL_USER = '${email}' AND PASSWORD_USER = '${pass}'",
    query_terminateTest: "DELETE FROM TBL_TEST WHERE PK_SENSOR = ${pk_sensor} AND TYPE_TEST = '${type}'",
    query_dataDetailComponent: "SELECT * FROM ${table} WHERE PK_SENSOR = ${pk_sensor}"
};
