/**
 * Created by sbv23 on 17/12/2016.
 */
/**
 * Created by sbv23 on 09/12/2016.
 */
var express = require('express');
var router = express.Router();
var db = require('../db/connection');
var response = require('../message');
var jwt = require('jsonwebtoken');
var config = require('../config');
var functions = require('../functions');



/* GET home page. */
router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var pass = req.body.password;
    var sql = "SELECT count(*) AS counter, email_user, password_user FROM TBL_USER WHERE EMAIL_USER = '"+email+"' AND PASSWORD_USER = '"+pass+"'";
    db.query(sql , function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else {
            if (result[0].counter != 0) {
                var user = {
                    email: result[0].email_user,
                    password: result[0].password_user
                };
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 604800
                });
                var sres = '{"token": "' + token + '",' +
                    '"user": ' + JSON.stringify(result[0]) + '}';

                res.status(200).send(JSON.parse(response.msg("001", "Created token", sres)));
            } else {
                res.status(404).send(JSON.parse(response.msg("002", "Not found user", "null")));
            }
        }
        //res.send("resultado query " + result.rowCount);
    });
});

//middleware check token
router.use(function (req, res, next) {
    var token = req.headers.authorization;

    if (token){
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err){
                return res.status(401).send(JSON.parse(response.msg("002","Unauthorized", "null")));
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        return res.status(403).send(JSON.parse(response.msg("003","Access denied","null")));
    }
});

router.get('/', function(req, res) {
    res.json({ message: 'Tienes acceso!' });
});

router.post('/network', function (req, res) {
   var email = req.body.email;

   var sql = "SELECT * FROM TBL_NETWORK WHERE email_user = '" + email +"'";

   db.query(sql, function (err, result) {
       if (err){
           res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
       }else{
           console.log(result.length);
           if (result.length == 0){
               var sres = '{"networks": null}';
               res.status(200).send(JSON.parse(response.msg("002", "Not found networks", sres)));
           }else{
               var sres = '{"networks": ' + JSON.stringify(result) + '}';
               res.status(200).send(JSON.parse(response.msg("001", "List networks", sres)));
           }
       }
   });

});

router.post('/sensor_register', function (req,res) {
   var serial = req.body.serial;
   var network = req.body.network;
   var name = req.body.name;


   var sql = "SELECT PK_SENSOR FROM TBL_SENSOR WHERE SERIAL_SENSOR = '"+serial+"' AND STATUS_SENSOR = 'Activo'";
   db.query(sql, function (err, result) {
      if (err){
          res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
      } else{
          if (result.length == 0){
              //no existe registro
              insertSensor(serial, network, name, res);
          }else{
              //existe registro
              var sql = "UPDATE TBL_SENSOR SET STATUS_SENSOR = 'Inactivo' WHERE PK_SENSOR = "+result[0].PK_SENSOR;
              db.query(sql, function (err, result) {
                 if (err){
                     res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
                 } else{
                     if (result.affectedRows != 0){
                         //atualizo
                         insertSensor(serial, network, name, res);
                     }else{
                         //no actualizo
                         res.status(500).send(JSON.parse(response.msg("003","not update data", "null")));
                     }
                 }
              });
          }
      }
   });



});

function insertSensor(serial, network, name, res) {
    var date = functions.datetime();
    console.log(date);
    var sql = "INSERT INTO TBL_SENSOR (SERIAL_SENSOR, PK_NETWORK, NAME_SENSOR, STATUS_SENSOR, REGISTERDATE_SENSOR, UPDATEDATE_SENSOR) VALUES ('"+ serial +"', "+ network +", '"+name+"', 'Activo', '"+date+"', '"+date+"')";
    db.query(sql, function (err, result) {
        console.log("consulta");
        if (result.affectedRows != 0){
            //insertado correctamente
            res.status(200).send(JSON.parse(response.msg("001", "Sensor registered", null)));
        }else{
            res.status(200).send(JSON.parse(response.msg("002", "Not sensor registered", null)));
            //error insertando
        }
    });
}

module.exports = router;

