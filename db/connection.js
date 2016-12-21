/**
 * Created by sbv23 on 09/12/2016.
 */
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'dbserveriot.cgud7zqnytaf.us-west-2.rds.amazonaws.com',
    user            : 'dbserveriot',
    password        : 'iot12345',
    database        : 'dbserveriot'
});

exports.query = function query(sql, data) {
    pool.getConnection(function (err, conn) {
        if (err){
            data(err, conn);
        }
        conn.query(sql, function (err, result) {
            conn.release();
            if (err){
                data(err, result);
            }
            data(err,result);
        })

    })
}