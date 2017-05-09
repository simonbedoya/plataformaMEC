/**
 * Created by sbv23 on 9/05/2017.
 */
const db = require('../db/connection');
const sqlQuery = require('../sql/sql_alert');
const template = require('es6-template-strings');
const path = require('path');
const functions = require('../functions');
const mkdirp = require('mkdirp');
const config = require('../config');
const exec = require('child_process').exec;

module.exports = {
    getNetworksByUser: function (email) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.getNetowrkByUser,{email: email}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200 ,code: "001", msg:"Network List", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202 ,code: "002", msg: "Error", data: {}});
                    }
                });
            }
        )
    },
    getSensorByUser: function(email){
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.getSensorByUser,{email: email}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200 ,code: "001", msg:"Sensor List", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202 ,code: "002", msg: "Error", data: {}});
                    }
                });
            }
        )
    },
    getListEvents: function (email) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.getListEventByUser,{email: email}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200 ,code: "001", msg:"Sensor List", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202 ,code: "002", msg: "Error", data: {}});
                    }
                });
            }
        )
    }
};