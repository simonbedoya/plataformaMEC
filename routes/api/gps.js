/**
 * Created by sbv23 on 15/03/2017.
 */

var express = require('express');
var router = express.Router();
var db = require('../../db/connection');
var response = require('../../message');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var functions = require('../../functions');

router.post("/", function (req,res) {
    var status = req.body.status;
    var descript = req.body.descript;
    var baudRate = req.body.baudRate;
    var msjNMEA = req.body.msjNMEA;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "SELECT count(*) AS counter FROM TBL_GPS WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result[0].counter != 0){
                //existe registro del sensor en tabla
                res.status(200).send(JSON.parse(response.msg("003", "Already gps information registered", null)));
            }else{
                var sql = "INSERT INTO TBL_GPS (PK_SENSOR, STATUS_GPS, DESCRIPT_GPS, BAUDRATE_GPS, MSJNMEA, ERROR_GPS, UPDATEDATE_GPS) VALUES (" + req.decoded.pkSensor + ",'" + status + "','" + descript + "',"+baudRate+",'"+msjNMEA+"','" + error + "','" + date + "')";
                db.query(sql, function (err, result) {
                    if (err) {
                        res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
                    } else {
                        if (result.affectedRows == 1) {
                            res.status(200).send(JSON.parse(response.msg("001", "gps information registered", null)));
                        } else {
                            res.status(200).send(JSON.parse(response.msg("002", "Not gps information registered", null)));
                        }
                    }
                });
            }
        }
    });
});

router.put('/',function (req,res) {
    var status = req.body.status;
    var descript = req.body.descript;
    var baudRate = req.body.baudRate;
    var msjNMEA = req.body.msjNMEA;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "UPDATE TBL_GPS SET STATUS_GPS = '" + status + "', DESCRIPT_GPS = '" + descript + "', BAUDRATE_GPS = " + baudRate + ", MSJNMEA = '"+msjNMEA+"', ERROR_GPS = '" + error + "', UPDATEDATE_GPS = '" + date + "' WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
        } else {
            if (result.affectedRows == 1) {
                res.status(200).send(JSON.parse(response.msg("001", "GPS information updated", null)));
            } else {
                res.status(200).send(JSON.parse(response.msg("002", "Not GPS information updated", null)));
            }
        }
    });
});

router.get('/', function (req,res) {
    var sql = "SELECT STATUS_GPS, DESCRIPT_GPS, BAUDRATE_GPS, MSJNMEA, ERROR_GPS FROM TBL_GPS WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result.length != 0){
                res.status(200).send(JSON.parse(response.msg("001", "GPS Data", JSON.stringify(result[0]))));
            }else{
                res.status(200).send(JSON.parse(response.msg("002", "Not found gps data", "null")));
            }
        }
    });
});

module.exports = router;
