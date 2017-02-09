/**
 * Created by sbv23 on 16/01/2017.
 */
var express = require('express');
var router = express.Router();
var db = require('../db/connection');
var response = require('../message');
var config = require('../config');
var functions = require('../functions');

router.post('/location', function (req, res) {
   var email = req.body.email;
   var sql = "SELECT LAT_LOCATION, LNG_LOCATION, ADDRESS_NETWORK, NAME_SENSOR, SERIAL_SENSOR, REGISTERDATE_SENSOR, NAME_NETWORK FROM TBL_LOCATION INNER JOIN TBL_SENSOR ON TBL_LOCATION.PK_SENSOR = TBL_SENSOR.PK_SENSOR INNER JOIN TBL_NETWORK ON TBL_SENSOR.PK_NETWORK = TBL_NETWORK.PK_NETWORK WHERE EMAIL_USER = '"+email+"' AND STATUS_SENSOR = 'Activo'";
   db.query(sql, function (err, result) {
     if (err){
        return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
     }
     if(result.length != 0){
        //console.log("llego");
        res.status(200).send(JSON.parse(response.msg("001","Locations", JSON.stringify(result))));
     }else{
        return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));

     }
     //res.status(202).send(JSON.parse(response.msg("001", "Not found user", "null")));
   });
});

router.post('/networks', function (req, res) {
    var email = req.body.email;
    var sql = "SELECT * FROM TBL_NETWORK WHERE EMAIL_USER = '"+email+"'";
    db.query(sql, function (err, result) {
        if (err){
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        if(result.length != 0){
            //console.log("llego");
            res.status(200).send(JSON.parse(response.msg("001","Networks", JSON.stringify(result))));
        }else{
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        //res.status(202).send(JSON.parse(response.msg("001", "Not found user", "null")));
    });
});

router.post('/sensors_networks', function (req, res) {
    var network = req.body.network;
    var sql = "SELECT count(*) AS SENSORS FROM TBL_SENSOR WHERE PK_NETWORK = '"+network+"' AND STATUS_SENSOR = 'Activo'";
    db.query(sql, function (err, result) {
        if (err){
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        if(result.length != 0){
            //console.log("llego");
            res.status(200).send(JSON.parse(response.msg("001","Networks", JSON.stringify(result))));
        }else{
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        //res.status(202).send(JSON.parse(response.msg("001", "Not found user", "null")));
    });
});

router.post('/update_network', function (req, res) {
    var network = req.body.network;
    var name = req.body.name;
    var address = req.body.address;
    var status = req.body.status;
    var date = functions.datetime();

    var sql = "UPDATE TBL_NETWORK SET NAME_NETWORK = '"+name+"', ADDRESS_NETWORK = '"+address+"', STATUS_NETWORK = '"+status+"', UPDATEDATE_NETWORK = '"+date+"' WHERE PK_NETWORK = "+network+"";
    db.query(sql, function (err, result) {
        if (err){
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        if(result.changedRows != 0){
            //console.log("llego");
            res.status(200).send(JSON.parse(response.msg("001","Update Network", "null")));
        }else{
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        //res.status(202).send(JSON.parse(response.msg("001", "Not found user", "null")));
    });
});

router.post('/delete_network', function (req, res) {
    var network = req.body.network;

    var sql = "DELETE FROM TBL_NETWORK WHERE PK_NETWORK = "+network+"";
    db.query(sql, function (err, result) {
        if (err){
            //res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
            res.end();
        }else {
            if (result.affectedRows != 0) {
                //console.log("llego");
                return res.status(200).send(JSON.parse(response.msg("001", "Update Network", "null")));
            } else {
                return res.status(202).send(JSON.parse(response.msg("002", "Error", "null")));
            }
        }
        //res.status(202).send(JSON.parse(response.msg("001", "Not found user", "null")));
    });
});

router.post('/create_network', function (req, res) {
    var name = req.body.name;
    var address = req.body.address;
    var status = req.body.status;
    var pk_user = req.body.user;
    var sess = req.session;
    sess.pk_user = pk_user;
    var date = functions.datetime();

    var sql = "INSERT INTO TBL_NETWORK (PK_USER, EMAIL_USER, NAME_NETWORK, ADDRESS_NETWORK, STATUS_NETWORK, CREATEDDATE_NETWORK, UPDATEDATE_NETWORK) VALUES ("+sess.pk_user+",'"+sess.user+"','"+name+"','"+address+"','"+status+"','"+date+"','"+date+"')";
    db.query(sql, function (err, result) {
        if (err){
            //res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
            res.end();
        }else {
            if (result.affectedRows != 0) {
                //console.log("llego");
                return res.status(200).send(JSON.parse(response.msg("001", "Update Network", "null")));
            } else {
                return res.status(202).send(JSON.parse(response.msg("002", "Error", "null")));
            }
        }
        //res.status(202).send(JSON.parse(response.msg("001", "Not found user", "null")));
    });
});

router.post('/sensors', function(req, res){
    var email = req.body.email;
    var sql = "SELECT * FROM TBL_NETWORK INNER JOIN TBL_SENSOR ON TBL_NETWORK.PK_NETWORK = TBL_SENSOR.PK_NETWORK WHERE EMAIL_USER = '"+email+"' AND STATUS_SENSOR = 'Activo'";
    db.query(sql, function (err, result) {
        if (err){
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        if(result.length != 0){
            //console.log("llego");
            res.status(200).send(JSON.parse(response.msg("001","Sensors", JSON.stringify(result))));
        }else{
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        //res.status(202).send(JSON.parse(response.msg("001", "Not found user", "null")));
    });
});

router.post('/sensorsByNetwork', function(req, res){
    var sess = req.session;
    var pk_network = req.body.pk_network;
    if(pk_network != 0) {
        var sql = "SELECT * FROM TBL_NETWORK INNER JOIN TBL_SENSOR ON TBL_NETWORK.PK_NETWORK = TBL_SENSOR.PK_NETWORK WHERE TBL_NETWORK.PK_NETWORK = " + pk_network + " AND STATUS_SENSOR = 'Activo'";
    }else{
        var sql = "SELECT * FROM TBL_NETWORK INNER JOIN TBL_SENSOR ON TBL_NETWORK.PK_NETWORK = TBL_SENSOR.PK_NETWORK WHERE EMAIL_USER = '" + sess.user + "' AND STATUS_SENSOR = 'Activo'";
    }
    db.query(sql, function (err, result) {
        if (err){
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        if(result.length != 0){
            //console.log("llego");
            res.status(200).send(JSON.parse(response.msg("001","Sensors", JSON.stringify(result))));
        }else{
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        //res.status(202).send(JSON.parse(response.msg("001", "Not found user", "null")));
    });
});

router.post('/updateNameSensor', function(req, res){
    var pk_sensor = req.body.pk_sensor;
    var name = req.body.name;
    var sql = "UPDATE TBL_SENSOR SET NAME_SENSOR = '"+name+"' WHERE PK_SENSOR='"+pk_sensor+"'";
    db.query(sql, function (err, result) {
        if (err){
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        if(result.changedRows != 0){
            //console.log("llego");
            res.status(200).send(JSON.parse(response.msg("001","Update name sensor", JSON.stringify(result))));
        }else{
            return res.status(202).send(JSON.parse(response.msg("002","Error", "null")));
        }
        //res.status(202).send(JSON.parse(response.msg("001", "Not found user", "null")));
    });
});

module.exports = router;
