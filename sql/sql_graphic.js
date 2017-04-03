/**
 * Created by sbv23 on 01/04/2017.
 */
module.exports = {
  query_getDateList: "SELECT tbf.DATE_FILE, count(tbf.PATH_FILE) AS N_FILES FROM TBL_SENSOR tbs INNER JOIN TBL_LOCATION tbl ON tbl.PK_SENSOR = tbs.PK_SENSOR AND tbl.STATUS_LOCATION = 'Activa' INNER JOIN TBL_FILE tbf ON tbl.PK_LOCATION = tbf.PK_LOCATION WHERE tbs.SERIAL_SENSOR = '${serial}' GROUP BY tbf.DATE_FILE"
};
