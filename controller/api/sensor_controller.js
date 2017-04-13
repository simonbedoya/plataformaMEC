/**
 * Created by sbv23 on 26/03/2017.
 */
const db = require('../../db/connection');
const sqlQuery = require('../../sql/sql_api');
const template = require('es6-template-strings');
const path = require('path');
const mkdirp = require('mkdirp');
const config = require('../../config');
const exec = require('child_process').exec;
const functions = require('../../functions');


module.exports = {
    sensorRegister: function (serial) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_validateRegister,{serial: serial}), function (err, result) {
                    console.log(err);
                    if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error", data: null});

                    if(result.length === 0){
                        fullfill({hcode: 0 ,code: "001", msg:"No existe registro", data: result[0]});
                    }else{
                        fullfill({hcode: 0 ,code: "002", msg: "Existe registro", data: result[0]});
                    }
                });
            })
    },
    insertSensor: function (serial,network,name) {
        return new Promise(
            function (fullfill) {
                let date = functions.datetime();
                db.query(template(sqlQuery.query_insertSensor,{serial: serial,network: network, name: name, date1: date, date2: date}), function (err, result) {
                    console.log(err);
                    if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error", data: null});

                    if (result.affectedRows !== 0){
                        //insertado correctamente
                        fullfill({hcode: 200 ,code: "001", msg:"Sensor registered", data: null});
                    }else{
                        fullfill({hcode: 202 ,code: "002", msg:"Not Sensor registered", data: null});
                        //error insertando
                    }
                });
            }
        )
    },
    updateSensor: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                let date = functions.datetime();
                db.query(template(sqlQuery.query_updateSensor,{date: date, pk_sensor: pk_sensor}), function (err, result) {
                    console.log(err);
                    if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error", data: null});

                    if (result.affectedRows !== 0){
                       //atualizo
                        fullfill({hcode: 0 ,code: "001", msg:"Sensor updated", data: null});
                    }else{
                       //no actualizo
                        fullfill({hcode: 202 ,code: "003", msg:"Not Sensor updated", data: null});
                    }
                });
            }
        )
    },
    verifyUploadPath: function (uploadPath) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_verifyUploadPath,{uploadPath: uploadPath}), function (err, result) {
                    if(err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result[0].counter === 0){
                        let new_path = path.join(config.dir_files_data, uploadPath);
                        mkdirp(new_path,function (err) {
                            if(err === null){
                                fullfill({hcode: 200, code: "001", msg: "Verify correct", data: null});
                            }else{
                                fullfill({hcode: 202, code: "003", msg: "Exist path", data: null});
                            }
                        });
                    }else{
                        fullfill({hcode: 202, code: "003", msg: "Exist path", data: null});
                    }
                });
            })
    },
};