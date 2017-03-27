/**
 * Created by sbv23 on 15/03/2017.
 */

let express = require('express');
let router = express.Router();
let db = require('../../db/connection');
let response = require('../../message');
let config = require('../../config');
let functions = require('../../functions');
let locationController = require('../../controller/api/location_controller');

router.post('/', function(req,res){
    locationController.verifyRegisterLocation(req.decoded.pkSensor).then(function (data) {
       if(data.code === "002"){
           //inserta informacion
           locationController.getUploadPathNetwork(req.decoded.pkSensor).then(function (data) {
              if(data.code === "001") {
                  let uploadPathNetwork = data.data.UPLOADPATH_NETWORK;
                  let uploadPath = functions.random(5, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
                  locationController.verifyUploadPath(uploadPathNetwork,uploadPath).then(function (data) {
                      if(data.code === "001"){
                          //inserte la localizacion
                          let date = functions.datetime();
                          locationController.insertLocation(req.decoded.pkSensor,req.body.latitude,req.body.longitude,req.body.altitude,req.body.address,date, uploadPath).then(function (data) {
                              res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
                          })
                      }else{
                          //error
                          res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
                      }
                  })
              }else{
                  res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
              }
           });
       } else{
           //existe el resgistro
           //o error
           res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
       }
    });
});

router.put('/',function (req,res) {
    let lat_loc = req.body.latitude;
    let lng_loc = req.body.longitude;
    let alt_loc = req.body.altitude;
    let address = req.body.address;
    let date = functions.datetime();

    let sql = "UPDATE TBL_LOCATION SET LAT_LOCATION = '" + lat_loc + "', LNG_LOCATION = '" + lng_loc + "', ALT_LOCATION = '" + alt_loc + "', ADDRESS_LOCATION = '" + address + "', UPDATEDATE_LOCATION = '" + date + "' WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(JSON.parse(response.msg("005", "Internal error", "null")));
        } else {
            if (result.affectedRows === 1) {
                res.status(200).send(JSON.parse(response.msg("001", "Location information updated", null)));
            } else {
                res.status(200).send(JSON.parse(response.msg("002", "Not location information updated", null)));
            }
        }
    });
});

router.get('/', function (req,res) {
    let sql = "SELECT LAT_LOCATION, LNG_LOCATION, ALT_LOCATION, ADDRESS_LOCATION FROM TBL_LOCATION WHERE PK_SENSOR = "+req.decoded.pkSensor;
    db.query(sql, function (err, result) {
        if(err){
            res.status(500).send(JSON.parse(response.msg("005","Internal error", "null")));
        }else{
            if(result.length !== 0){
                res.status(200).send(JSON.parse(response.msg("001", "location data", JSON.stringify(result[0]))));
            }else{
                res.status(200).send(JSON.parse(response.msg("002", "Not found location data", "null")));
            }
        }
    });
});

module.exports = router;
