/**
 * Created by sbv23 on 26/03/2017.
 */
const db = require('../../db/connection');
const sqlQuery = require('../../sql/sql_api');
const template = require('es6-template-strings');
const path = require('path');
const mkdirp = require('mkdirp');
const config = require('../../config');
const functions = require('../../functions');


module.exports = {
    verifyRegisterLocation: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_verifyRegisterLocation,{pk_sensor: pk_sensor}), function (err, result) {
                    if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error", data: null});

                    if(result[0].counter !== 0){
                        //existe registro
                        fullfill({hcode: 200 ,code: "003", msg:"Already location information registered", data: null});
                    }else{
                        fullfill({hcode: 0 ,code: "002", msg: "No Existe registro", data: null});
                    }
                });
            })
    },
    verifyUploadPath: function (uploadPathNetwork,uploadPath) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_verifyUploadPath,{uploadPath: uploadPath}), function (err, result) {
                    if(err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result[0].counter === 0){
                        let pathComplete = uploadPathNetwork + "/" + uploadPath;
                        let pathC = path.join(uploadPathNetwork,uploadPath);
                        let new_path = path.join(config.dir_files_data, pathComplete);
                        mkdirp(new_path,function (err) {
                            if(err === null){
                                fullfill({hcode: 200, code: "001", msg: "Verify correct", data: new_path});
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
    getUploadPathNetwork: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getUploadPathNetwork,{pk_sensor: pk_sensor}),function (err, result) {
                    if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200, code: "001", msg: "Uploadpath Network", data: result[0]});
                    }else{
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                })
            }
        )
    },
    insertLocation: function (pk_sensor, lat, lng, alt, address, date, uploadpath) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_insertLocation,{pk_sensor: pk_sensor, lat: lat, lng: lng, alt: alt, address: address, date1: date, date2: date, uploadpath: uploadpath}), function (err, result) {
                    if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error", data: null});

                    if (result.affectedRows === 1) {
                        fullfill({hcode: 200, code: "001", msg: "Location information registered", data: null});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Not location information registered", data: null});
                    }
                });
            }
        )
    },
    updateLocations: function (pk_sensor, date) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_updateLocations,{pk_sensor: pk_sensor, date: date}), function (err, result) {
                    if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error", data: null});

                    if (result.affectedRows === 1) {
                        fullfill({hcode: 200, code: "001", msg: "Location information updated", data: null});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Not location information updated", data: null});
                    }
                });
            }
        )
    }
};