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
const coordinate = require('coordinate-parser');

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
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200, code: "001", msg: "Sensors", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202, code: "002", msg: "No sensor", data: null});
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
                exec(config.remove_l + ' "' + config.dir_files_data + '/' + uploadPath + '"', function (err) {
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
                        console.log(result);
                        let position = new coordinate("'"+result[0].LAT_LOCATION+result[0].LNG_LOCATION+"'");
                        let lat = position.getLatitude();
                        let long = position.getLongitude();
                        console.log('let '+lat + ' long '+long);
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
    },
    getDateList: function (serial,date,axis) {
        return new Promise(
            function (fullfill) {
                let sql;
                console.log(axis);
                if(axis === undefined){
                    sql = template(sqlQuery.query_dateList,{serial: serial,date: date});
                }else{
                    sql = template(sqlQuery.query_dateListFilter,{serial: serial,date: date, axis: axis});
                }
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Date List", data: JSON.stringify(result)});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            }
        )
    },
    getDates: function (serial,axis) {
        return new Promise(
            function (fullfill) {
                let sql;
                console.log(axis);
                if(axis === undefined){
                    sql = template(sqlQuery.query_dates,{serial: serial});
                }else{
                    sql = template(sqlQuery.query_datesfilter,{serial: serial, axis: axis})
                }
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Date List", data: JSON.stringify(result)});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            }
        )
    },
    getDataFileByPk: function (pk_file) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getDataFileByPk,{pk_file: pk_file}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "Date List", data: result[0]});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            }
        )
    },
    getDataFilePath: function (path_file,date_file) {
        return new Promise(
            function (fullfill) {
                exec(`/opt/serverMEC/plataformaMEC/ReadFileSAC/readsac ${path_file}`,{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
                        console.log(err);
                        if(err) return fullfill({hcode: 202, code: "003", msg: "Error", data: err});

                        //console.log(stdout);
                        fullfill({hcode: 202, code: "001", msg: date_file, data: stdout})
                })
            }
        )
    },
    terminateTest: function (pk_sensor, type) {
        return new Promise(
            function (fullfill) {
                let sql = template(sqlQuery.query_terminateTest,{pk_sensor: pk_sensor, type: type});
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if (result.affectedRows !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "terminate test", data: null});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    },
    getDataDetailComponent: function (pk_sensor, component) {
        return new Promise(
            function (fullfill) {
                let table = `TBL_${component}`;
                let sql = template(sqlQuery.query_dataDetailComponent,{table: table, pk_sensor: pk_sensor});
                console.log(sql);
                db.query(sql, function (err, result) {
                    console.log(err);
                    console.log(result);
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "details", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "no hay datos", data: null});
                    }
                });
            })
    },
    getSamplesADCBySensor: function (pk_sensor) {
        return new Promise(
            function (fullfill) {
                let sql = template(sqlQuery.query_getSamplesBysensor,{pk_sensor: pk_sensor});
                console.log(sql);
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "details", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "no hay datos", data: null});
                    }
                });
            })
    },
    getNotificationByUser: function (email) {
        return new Promise(
            function (fullfill) {
                let sql = template(sqlQuery.query_getNotificationByUser,{email: email});
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "notifications", data: JSON.stringify(result)});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "no hay datos", data: null});
                    }
                });
            })
    },
    getNumberNotification: function (email) {
        return new Promise(
            function (fullfill) {
                let sql = template(sqlQuery.query_getNumberNotificationByUser,{email: email});
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "number notifications", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "no hay datos", data: null});
                    }
                });
            })
    },
    getNotificationByTag: function (email,type) {
        return new Promise(
            function (fullfill) {
                let sql = template(sqlQuery.query_getNotificationByTag,{email: email, type: type});
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "number notifications", data: JSON.stringify(result)});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "no hay datos", data: null});
                    }
                });
            })
    },
    getNumberNotificationByTag: function (email,type) {
        return new Promise(
            function (fullfill) {
                let sql = template(sqlQuery.query_getNumberNotificationByTag,{email: email, type: type});
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "number notifications", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "no hay datos", data: null});
                    }
                });
            })
    },
    getNotificationNoRead: function (email) {
        return new Promise(
            function (fullfill) {
                let sql = template(sqlQuery.query_getNumberNotificationNoRead,{email: email});
                db.query(sql, function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "003", msg: "Error", data: null});

                    if (result.length !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "number notifications", data: JSON.stringify(result[0])});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "no hay datos", data: null});
                    }
                });
            })
    },
    deleteNotification: function (arrayId) {
        return new Promise(
            function (fullfill) {
                console.log(arrayId);
                let sql = template(sqlQuery.query_deleteNotifications,{ids: arrayId.toString()});
                console.log(sql);
                db.query(sql, function (err, result) {
                    console.log(err);
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if (result.affectedRows !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "terminate test", data: null});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    },
    markNotification: function (arrayId,mark) {
        return new Promise(
            function (fullfill) {
                console.log(arrayId);
                let sql = template(sqlQuery.query_markNotification,{ids: arrayId, mark: mark});
                console.log(sql);
                db.query(sql, function (err, result) {
                    console.log(err);
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if (result.affectedRows !== 0) {
                        fullfill({hcode: 200, code: "001", msg: "terminate test", data: null});
                    } else {
                        fullfill({hcode: 202, code: "002", msg: "Error", data: null});
                    }
                });
            })
    }
};


