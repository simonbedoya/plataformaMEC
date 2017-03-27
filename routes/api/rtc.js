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
    var dateHour = req.body.dateHour;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "SELECT count(*) AS counter FROM TBL_RTC WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result[0].counter != 0){
                //existe registro del sensor en tabla
                res.status(200).send(JSON.parse(response.msg("003", "Already rtc information registered", null)));
            }else{
                var sql = "INSERT INTO TBL_RTC (PK_SENSOR, STATUS_RTC, DESCRIPT_RTC, DATEHOUR_RTC, ERROR_RTC, UPDATEDATE_RTC) VALUES (" + req.decoded.pkSensor + ",'" + status + "','" + descript + "','" + dateHour + "','" + error + "','" + date + "')";
                db.query(sql, function (err, result) {
                    if (err) {
                        res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
                    } else {
                        if (result.affectedRows == 1) {
                            res.status(200).send(JSON.parse(response.msg("001", "RTC information registered", null)));
                        } else {
                            res.status(200).send(JSON.parse(response.msg("002", "Not rtc information registered", null)));
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
    var dateHour = req.body.dateHour;
    var error = req.body.error;
    var date = functions.datetime();

    var sql = "UPDATE TBL_RTC SET STATUS_RTC = '" + status + "', DESCRIPT_RTC = '" + descript + "', DATEHOUR_RTC = '" + dateHour + "', ERROR_RTC = '" + error + "', UPDATEDATE_RTC = '" + date + "' WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
        } else {
            if (result.affectedRows == 1) {
                res.status(200).send(JSON.parse(response.msg("001", "RTC information updated", null)));
            } else {
                res.status(200).send(JSON.parse(response.msg("002", "Not RTC information updated", null)));
            }
        }
    });
});

router.get('/', function (req,res) {
    var sql = "SELECT STATUS_RTC, DESCRIPT_RTC, DATEHOUR_RTC, ERROR_RTC FROM TBL_RTC WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result.length != 0){
                res.status(200).send(JSON.parse(response.msg("001", "RTC Data", JSON.stringify(result[0]))));
            }else{
                res.status(200).send(JSON.parse(response.msg("002", "Not found rtc data", "null")));
            }
        }
    });
});

module.exports = router;
