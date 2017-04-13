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
    var error = req.body.error;
    var date = functions.datetime();
    console.log(req.decoded.pkSensor);
    var sql = "SELECT count(*) AS counter FROM TBL_ACCELEROMETER WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result[0].counter != 0){
                //existe registro del sensor en tabla
                res.status(200).send(JSON.parse(response.msg("003", "Already accelerometer information registered", null)));
            }else{
                var sql = "INSERT INTO TBL_ACCELEROMETER (PK_SENSOR, STATUS_ACCELEROMETER, DESCRIPT_ACCELEROMETER, ERROR_ACCELEROMETER, UPDATEDATE_ACCELEROMETER) VALUES (" + req.decoded.pkSensor + ",'" + status + "','" + descript + "','" + error + "','" + date + "')";
                db.query(sql, function (err, result) {
                    if (err) {
                        res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
                    } else {
                        if (result.affectedRows == 1) {
                            res.status(200).send(JSON.parse(response.msg("001", "accelerometer information registered", null)));
                        } else {
                            res.status(200).send(JSON.parse(response.msg("002", "Not accelerometer information registered", null)));
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
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "UPDATE TBL_ACCELEROMETER SET STATUS_ACCELEROMETER = '" + status + "', DESCRIPT_ACCELEROMETER = '" + descript + "', ERROR_ACCELEROMETER = '" + error + "', UPDATEDATE_ACCELEROMETER = '" + date + "' WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
        } else {
            if (result.affectedRows == 1) {
                res.status(200).send(JSON.parse(response.msg("001", "Accelerometer information updated", null)));
            } else {
                res.status(200).send(JSON.parse(response.msg("002", "Not accelerometer information updated", null)));
            }
        }
    });
});

router.get('/', function (req,res) {
    var sql = "SELECT STATUS_ACCELEROMETER, DESCRIPT_ACCELEROMETER, ERROR_ACCELEROMETER FROM TBL_ACCELEROMETER WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result.length != 0){
                res.status(200).send(JSON.parse(response.msg("001", "ACCELEROMETER Data", JSON.stringify(result[0]))));
            }else{
                res.status(200).send(JSON.parse(response.msg("002", "Not found accelerometer data", "null")));
            }
        }
    });
});

module.exports = router;
