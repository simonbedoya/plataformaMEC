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
    var ssid = req.body.ssid;
    var ipAdr = req.body.ipAdr;
    var macAdr = req.body.macAdr;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "SELECT count(*) AS counter FROM TBL_WIFI WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result[0].counter != 0){
                //existe registro del sensor en tabla
                res.status(200).send(JSON.parse(response.msg("003", "Already wifi information registered", null)));
            }else{
                var sql = "INSERT INTO TBL_WIFI (PK_SENSOR, STATUS_WIFI, DESCRIPT_WIFI, SSID_WIFI, IPADR_WIFI, MACADR_WIFI, ERROR_WIFI, UPDATEDATE_WIFI) VALUES (" + req.decoded.pkSensor + ",'" + status + "','" + descript + "','"+ssid+"','"+ipAdr+"','"+macAdr+"','" + error + "','" + date + "')";
                db.query(sql, function (err, result) {
                    if (err) {
                        res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
                    } else {
                        if (result.affectedRows == 1) {
                            res.status(200).send(JSON.parse(response.msg("001", "Wifi information registered", null)));
                        } else {
                            res.status(200).send(JSON.parse(response.msg("002", "Not wifi information registered", null)));
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
    var ssid = req.body.ssid;
    var ipAdr = req.body.ipAdr;
    var macAdr = req.body.macAdr;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "UPDATE TBL_WIFI SET STATUS_WIFI = '" + status + "', DESCRIPT_WIFI = '" + descript + "', SSID_WIFI = '" + ssid + "', IPADR_WIFI = '"+ipAdr+"', MACADR_WIFI = '"+macAdr+"', ERROR_WIFI = '" + error + "', UPDATEDATE_WIFI = '" + date + "' WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
        } else {
            if (result.affectedRows == 1) {
                res.status(200).send(JSON.parse(response.msg("001", "Wifi information updated", null)));
            } else {
                res.status(200).send(JSON.parse(response.msg("002", "Not wifi information updated", null)));
            }
        }
    });
});

router.get('/', function (req,res) {
    var sql = "SELECT STATUS_WIFI, DESCRIPT_WIFI, SSID_WIFI, IPADR_WIFI, MACADR_WIFI, ERROR_WIFI FROM TBL_WIFI WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result.length != 0){
                res.status(200).send(JSON.parse(response.msg("001", "WIFI Data", JSON.stringify(result[0]))));
            }else{
                res.status(200).send(JSON.parse(response.msg("002", "Not found wifi data", "null")));
            }
        }
    });
});

module.exports = router;
