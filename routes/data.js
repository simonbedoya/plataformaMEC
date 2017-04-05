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
    data_controller.getDateList(req.body.serial,req.body.date).then(function (data) {
        res.status(data.hcode).send(JSON.parse(response.msg(data.code,data.msg, data.data)));
    })
});

router.post('/getDates', function (req,res) {
    let axis = req.body.axis;
    if(axis !== undefined) {
        data_controller.getDates(req.body.serial).then(function (data) {
            res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
        })
    }else{
        data_controller.getDatesFilter(req.body.serial,axis).then(function (data) {
            res.status(data.hcode).send(JSON.parse(response.msg(data.code, data.msg, data.data)));
        })
    }
});

router.post('/getDataFileByPk', function (req,res) {
    data_controller.getDataFileByPk(req.body.pk_file).then(function (data) {
        if(data.code === "001"){
            let path_file = data.data;
            data_controller.getDataFilePath(path_file).then(function (data) {
                res.status(data.hcode).send(data.data);
            })
        }

    })
});

module.exports = router;
