/**
 * Created by sbv23 on 17/12/2016.
 */
/**
 * Created by sbv23 on 09/12/2016.
 */
let express = require('express');
let router = express.Router();
let db = require('../db/connection');
let response = require('../message');
let jwt = require('jsonwebtoken');
let config = require('../config');
let functions = require('../functions');

let battery = require('./api/battery');
let adc = require('./api/adc');
let rtc = require('./api/rtc');
let gps = require('./api/gps');
let cpu = require('./api/cpu');
let accelerometer = require('./api/accelerometer');
let wifi = require('./api/wifi');
let location = require('./api/location');
let upload = require('./api/upload');
let sensorController = require('../controller/api/sensor_controller');

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
                res.status(202).send(JSON.parse(response.msg("002", "Not found user", "null")));
            }
        }
        //res.send("resultado query " + result.rowCount);
    });
});

router.post("/auth", function (req,res) {
   var serial = req.body.serial;

   var sql = "SELECT pk_sensor FROM TBL_SENSOR WHERE serial_sensor = '"+serial+"' AND status_sensor = 'Activo'";
   db.query(sql, function(err, result){
       if(err){
           res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
       }else {
           if(result.length == 1){
               //existe el sensor
               var sensor = {
                   serialSensor: serial,
                   pkSensor: result[0].pk_sensor
               };
               var token = jwt.sign(sensor, config.secret, {
                   expiresIn: 604800
               });
               var sres = '{"token": "' + token + '"}';
               res.status(200).send(JSON.parse(response.msg("001", "Auth token", sres)));
           }else{
               //no existe el sensor o no esta asociado a una red
               res.status(202).send(JSON.parse(response.msg("002", "Not found sensor", "null")));
           }
       }
   });
});

//middleware check token
router.use(function (req, res, next) {
    //var token = req.get("authorization");
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
    sensorController.sensorRegister(req.body.serial).then(function (data) {
      if(data.code === "001"){
          //no existe registro
            sensorController.insertSensor(req.body.serial, req.body.network, req.body.name).then(function (data) {
                res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
            })
      } else if(data.code === "002"){
          //existe registro
            sensorController.updateSensor(data.data.PK_SENSOR).then(function (data) {
                if(data.code === "001"){
                    //insertar sensor
                    sensorController.insertSensor(req.body.serial, req.body.network, req.body.name).then(function (data) {
                        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
                    })
                }else{
                    res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
                }
            })
      }else {
          res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
      }
   });
});

router.use('/battery',battery);
router.use('/adc',adc);
router.use('/rtc',rtc);
router.use('/gps',gps);
router.use('/cpu',cpu);
router.use('/accelerometer',accelerometer);
router.use('/wifi',wifi);
router.use('/location',location);
router.use('/upload',upload);

module.exports = router;

