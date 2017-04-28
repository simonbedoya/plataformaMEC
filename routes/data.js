/**
 * Created by sbv23 on 16/01/2017.
 */
'use strict';
const express = require('express');
const router = express.Router();
const response = require('../message');
const functions = require('../functions');
const data_controller = require('../controller/data_controller');

//verificar session iniciada
router.use(function (req,res,next) {
    const session = req.session;
    if (session.remember){
        if (session.remember === false){
            //sesion cerrada
            res.redirect('admin');
        }else{
            //session iniciada
            next();
        }
    }else{
        res.redirect('admin');
    }
});

router.post('/location', function (req, res) {
    data_controller.getLocations(req.body.email).then(function(data){
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    })
});

router.post('/networks', function (req, res) {
    data_controller.getNetworks(req.body.email).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    });
});

router.post('/sensors_networks', function (req, res) {
    data_controller.countSensor_networks(req.body.network).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    });
});

router.post('/update_network', function (req, res) {
    data_controller.updateNetwork(req.body.network,req.body.name,req.body.address,req.body.status,functions.datetime()).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    });
});

router.post('/delete_network', function (req, res) {
    data_controller.getUploadPathNetwork(req.body.network).then(function (data) {
       if(data.code === "001"){
           let uploadPath = data.data[0].UPLOADPATH_NETWORK;
           data_controller.deleteNetwork(req.body.network).then(function (data) {
               if(data.code === "001"){
                   data_controller.removeFolder(uploadPath).then(function (data) {
                       res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
                   })
               }else{
                   res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
               }
           });
       } else{
           res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
       }
    });
});

router.post('/create_network', function (req, res) {
    let uploadPath = functions.random(5,'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    data_controller.verifyUploadPath(uploadPath).then(function (data) {
        if(data.code === "001"){
            data_controller.insertNetwork(req.body.user, req.session.user, req.body.name, req.body.address, req.body.status, functions.datetime(), uploadPath).then(function (data) {
                res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
            })
        }else{
            res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
        }
    })
});

router.post('/sensors', function(req, res){
    data_controller.getSensors(req.body.email).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    });
});

router.post('/sensorsByNetwork', function(req, res){
    data_controller.sensorByNetwork(req.body.pk_network, req.session).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    });
});

router.post('/updateNameSensor', function(req, res){
    data_controller.updateNamesensor(req.body.name, req.body.pk_sensor).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    });
});

router.post('/getLocationByPkSensor', function (req,res) {
    data_controller.getLocationByPkSensor(req.body.pk_sensor).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    })
});

router.post('/getInfoSensor', function (req,res) {
    data_controller.getInfoSensor(req.body.pk_sensor).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    })
});

router.post('/getLocationSensor', function (req,res) {
    data_controller.getLocationSensor(req.body.pk_sensor).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    })
});

router.post('/getNetworkSensor', function (req,res) {
    data_controller.getNetworkSensor(req.body.pk_sensor).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    })
});

router.post('/getCountEvents', function (req,res) {
    data_controller.getCountEvents(req.body.pk_sensor).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    })
});

router.post('/getStatusComponentSensor', function (req,res) {
    data_controller.getStatusComponentSensor(req.body.pk_sensor).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    })
});

router.post('/getDateList', function (req,res) {
    data_controller.getDateList(req.body.serial,req.body.date,req.body.axis).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    })
});

router.post('/getDates', function (req,res) {
   data_controller.getDates(req.body.serial,req.body.axis).then(function (data) {
       res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
   })
});

router.post('/getDataFileByPk', function (req,res) {
   data_controller.getDataFileByPk(req.body.pk_file).then(function (data) {
       if (data.code === "001") {
           let path_file = data.data.PATH_FILE;
           let date_file = data.data.DATE_FILE;
           data_controller.getDataFilePath(path_file,date_file).then(function (data) {
               res.status(data.hcode).send(data);
           })
       }
   })
});

router.post('/terminateTest', function (req,res) {
    data_controller.terminateTest(req.body.pk_sensor,req.body.type).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
    })
});

router.post('/getDataDetailComponent', function (req,res) {
    data_controller.getDataDetailComponent(req.body.pk_sensor,req.body.component).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
    })
});

router.post('/getSamplesADCBySensor', function (req,res) {
    data_controller.getSamplesADCBySensor(req.body.pk_sensor).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
    })
});

router.post('/getNotificationByUser', function (req,res) {
    data_controller.getNotificationByUser(req.body.email).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
    })
});

router.post('/getNumberNotification', function (req,res) {
    data_controller.getNumberNotification(req.body.email).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
    })
});

router.post('/getNotificationByTag', function (req,res) {
    data_controller.getNotificationByTag(req.body.email,req.body.type).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
    })
});

router.post('/getNumberNotificationByTag', function (req,res) {
    data_controller.getNumberNotificationByTag(req.body.email,req.body.type).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
    })
});

router.post('/getNotificationNoRead', function (req,res) {
    data_controller.getNotificationNoRead(req.body.email).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
    })
});

router.post('/deleteNotification', function (req,res) {
    data_controller.deleteNotification(req.body.email).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
    })
});

module.exports = router;
