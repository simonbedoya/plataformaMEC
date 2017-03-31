/**
 * Created by sbv23 on 21/03/2017.
 */
const db = require('../db/connection');
const sqlQuery = require('../sql/sql_data');
const template = require('es6-template-strings');
const path = require('path');
const functions = require('../functions');
const mkdirp = require('mkdirp');
const config = require('../config');
const exec = require('child_process').exec;


module.exports = {
    getLocations: function(email) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_location,{email: email}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200 ,code: "001", msg:"Locations", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202 ,code: "002", msg: "Error", data: null});
                    }
                });
            })
    },

    getNetworks: function (email) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_networks,{email: email}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200, code: "001", msg: "Networks", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    },

    countSensor_networks: function (network) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_countSensors,{network: network}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200, code: "001", msg: "Networks", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    },
    updateNetwork: function (network,name,address,status,date) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_updateNetwork,{network: network, name:name, address: address, status: status, date: date}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.changedRows !== 0){
                        fullfill({hcode: 200, code: "001", msg: "Update Network", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    },
    getSensors: function (email) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_sensors,{email: email}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200, code: "001", msg: "Sensors", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    },
    updateNamesensor: function (name, pk_sensor) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_updateNameSensor,{name: name, pk_sensor: pk_sensor}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.changedRows !== 0){
                        fullfill({hcode: 200, code: "001", msg: "Update name sensor", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    },
    sensorByNetwork: function (pk_network,user) {
        return new Promise(
            function (fullfill) {
                let sql = "";
                if(pk_network !== 0) {
                    sql = template(sqlQuery.query_sensorByNetwork1,{pk_network: pk_network});
                }else{
                    sql = template(sqlQuery.query_sensorByNetwork2,{user: user});
                }
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200, code: "001", msg: "Sensors", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
        })
    },
    insertNetwork: function (pk_user, user, name, address, status, date, uploadPath) {
        return new Promise(
            function (fullfill) {
                let sql = template(sqlQuery.query_insertNetwork,{pk_user: pk_user, user: user, name: name, address: address, status: status, date1: date, date2: date, uploadPath: uploadPath});
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if (result.affectedRows !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Insert Network", data: null});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
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
    getUploadPathNetwork: function (network) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getUploadPathNetwork,{network: network}),function (err, result) {
                   if(err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                   if(result.length !== 0){
                       fullfill({hcode: 200, code: "001", msg: "Exist uploadPath", data: result});
                   }else{
                       fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                   }
                });
            })
    },
    removeFolder: function (uploadPath) {
        return new Promise(
            function (fullfill) {
                exec(config.remove_w + ' "' + config.dir_files_data + '/' + uploadPath + '"', function (err) {
                    if(err === null){
                        fullfill({hcode: 200, code: "001", msg: "Delete uploadPath", data: null});
                    }else{
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    },
    deleteNetwork: function (network) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_deleteNetwork,{network: network}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Delete network", data: null});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    },
    getLocationByPkSensor: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getLocationByPkSensor,{pk_sensor: pk_sensor}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Location", data: JSON.stringify(result)});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            }
        )
    },
    getInfoSensor: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getInfoSensor,{pk_sensor: pk_sensor}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Info", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            }
        )
    },
    getLocationSensor: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getLocationSensor,{pk_sensor: pk_sensor}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "info location", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            }
        )
    },
    getNetworkSensor: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getNetworkSensor,{pk_sensor: pk_sensor}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Info network", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            }
        )
    },
    getCountEvents: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getCountEventSensor,{pk_sensor: pk_sensor}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Cont Alerts", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            }
        )
    },
    getStatusComponentSensor: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getStatusComponentSensor,{pk_sensor: pk_sensor}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Cont Alerts", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            }
        )
    }
};


