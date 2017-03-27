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

    var sql = "SELECT count(*) AS counter FROM TBL_CPU WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result[0].counter != 0){
                //existe registro del sensor en tabla
                res.status(200).send(JSON.parse(response.msg("003", "Already cpu information registered", null)));
            }else{
                var sql = "INSERT INTO TBL_CPU (PK_SENSOR, STATUS_CPU, DESCRIPT_CPU, ERROR_CPU, UPDATEDATE_CPU) VALUES (" + req.decoded.pkSensor + ",'" + status + "','" + descript + "','" + error + "','" + date + "')";
                db.query(sql, function (err, result) {
                    if (err) {
                        res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
                    } else {
                        if (result.affectedRows == 1) {
                            res.status(200).send(JSON.parse(response.msg("001", "cpu information registered", null)));
                        } else {
                            res.status(200).send(JSON.parse(response.msg("002", "Not cpu information registered", null)));
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

    var sql = "UPDATE TBL_CPU SET STATUS_CPU = '" + status + "', DESCRIPT_CPU = '" + descript + "', ERROR_CPU = '" + error + "', UPDATEDATE_CPU = '" + date + "' WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
        } else {
            if (result.affectedRows == 1) {
                res.status(200).send(JSON.parse(response.msg("001", "Cpu information updated", null)));
            } else {
                res.status(200).send(JSON.parse(response.msg("002", "Not cpu information updated", null)));
            }
        }
    });
});

router.get('/', function (req,res) {
    var sql = "SELECT STATUS_CPU, DESCRIPT_CPU, ERROR_CPU FROM TBL_CPU WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result.length != 0){
                res.status(200).send(JSON.parse(response.msg("001", "CPU Data", JSON.stringify(result[0]))));
            }else{
                res.status(200).send(JSON.parse(response.msg("002", "Not found cpu data", "null")));
            }
        }
    });
});

module.exports = router;
