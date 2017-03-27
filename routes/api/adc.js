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
    var samples = req.body.samples;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "SELECT count(*) AS counter FROM TBL_ADC WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result[0].counter != 0){
                //existe registro del sensor en tabla
                res.status(200).send(JSON.parse(response.msg("003", "Already adc information registered", null)));
            }else{
                var sql = "INSERT INTO TBL_ADC (PK_SENSOR, STATUS_ADC, DESCRIPT_ADC, SAMPLES_ADC, ERROR_ADC, UPDATEDATE_ADC) VALUES (" + req.decoded.pkSensor + ",'" + status + "','" + descript + "','"+samples+"','" + error + "','" + date + "')";
                db.query(sql, function (err, result) {
                    if (err) {
                        res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
                    } else {
                        if (result.affectedRows == 1) {
                            res.status(200).send(JSON.parse(response.msg("001", "adc information registered", null)));
                        } else {
                            res.status(200).send(JSON.parse(response.msg("002", "Not adc information registered", null)));
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
    var samples = req.body.samples;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "UPDATE TBL_ADC SET STATUS_ADC = '" + status + "', DESCRIPT_ADC = '" + descript + "', SAMPLES_ADC = " + samples + ", ERROR_ADC = '" + error + "', UPDATEDATE_ADC = '" + date + "' WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
        } else {
            if (result.affectedRows == 1) {
                res.status(200).send(JSON.parse(response.msg("001", "ADC information updated", null)));
            } else {
                res.status(200).send(JSON.parse(response.msg("002", "Not adc information updated", null)));
            }
        }
    });
});

router.get('/', function (req,res) {
    var sql = "SELECT STATUS_ADC, DESCRIPT_ADC, SAMPLES_ADC, ERROR_ADC FROM TBL_ADC WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result.length != 0){
                res.status(200).send(JSON.parse(response.msg("001", "ADC Data", JSON.stringify(result[0]))));
            }else{
                res.status(200).send(JSON.parse(response.msg("002", "Not found adc data", "null")));
            }
        }
    });
});

module.exports = router;

