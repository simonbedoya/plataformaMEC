/**
 * Created by sbv23 on 01/04/2017.
 */
const db = require('../db/connection');
const sqlQuery = require('../sql/sql_graphic');
const template = require('es6-template-strings');
const path = require('path');
const functions = require('../functions');
const mkdirp = require('mkdirp');
const config = require('../config');
const exec = require('child_process').exec;

module.exports = {
    getDateList: function (serial) {
        return new Promise(
            function (fullfill) {
                db.query(template(sqlQuery.query_getDateList,{serial: serial}), function (err, result) {
                    if (err) return fullfill({hcode: 202, code: "002", msg: "Error", data: null});

                    if(result.length !== 0){
                        fullfill({hcode: 200 ,code: "001", msg:"Date List", data: JSON.stringify(result)});
                    }else{
                        fullfill({hcode: 202 ,code: "002", msg: "Error", data: {}});
                    }
                });
            }
        )
    }
};