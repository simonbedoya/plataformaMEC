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


router.post('/', function(req,res){
    //req.decoded.pk_sensor
    //req.decoded.serial_sensor
    var status = req.body.status;
    var descript = req.body.descript;
    var charge = req.body.charge;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "SELECT count(*) AS counter FROM TBL_BATTERY WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result[0].counter != 0){
                //existe registro del sensor en tabla
                res.status(200).send(JSON.parse(response.msg("003", "Already battery information registered", null)));
            }else{
                //se puede registrar
                var sql = "INSERT INTO TBL_BATTERY (PK_SENSOR, STATUS_BATTERY, DESCRIPT_BATTERY, CHARGE_BATTERY, ERROR_BATTERY, UPDATEDATE_BATTERY) VALUES (" + req.decoded.pkSensor + ",'" + status + "','" + descript + "'," + charge + ",'" + error + "','" + date + "')";
                db.query(sql, function (err, result) {
                    if (err) {
                        res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
                    } else {
                        if (result.affectedRows == 1) {
                            res.status(200).send(JSON.parse(response.msg("001", "Battery information registered", null)));
                        } else {
                            res.status(200).send(JSON.parse(response.msg("002", "Not battery information registered", null)));
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
    var charge = req.body.charge;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "UPDATE TBL_BATTERY SET STATUS_BATTERY = '" + status + "', DESCRIPT_BATTERY = '" + descript + "', CHARGE_BATTERY = " + charge + ", ERROR_BATTERY = '" + error + "', UPDATEDATE_BATTERY = '" + date + "' WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
        } else {
            if (result.affectedRows == 1) {
                res.status(200).send(JSON.parse(response.msg("001", "Battery information updated", null)));
            } else {
                res.status(200).send(JSON.parse(response.msg("002", "Not battery information updated", null)));
            }
        }
    });
});

router.get('/', function (req,res) {
   var sql = "SELECT STATUS_BATTERY, DESCRIPT_BATTERY, CHARGE_BATTERY, ERROR_BATTERY FROM TBL_BATTERY WHERE PK_SENSOR = "+req.decoded.pkSensor;
   db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result.length != 0){
                res.status(200).send(JSON.parse(response.msg("001", "Battery data", JSON.stringify(result[0]))));
            }else{
                res.status(200).send(JSON.parse(response.msg("002", "Not found battery data", "null")));
            }
        }
   });
});

module.exports = router;
