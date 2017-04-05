/**
 * Created by sbv23 on 27/03/2017.
 */
const db = require('../../db/connection');
const sqlQuery = require('../../sql/sql_api');
const template = require('es6-template-strings');
const path = require('path');
const mkdirp = require('mkdirp');
const config = require('../../config');
const functions = require('../../functions');
const fs = require('fs');

module.exports = {
    insertFile: function (pk_sensor, path_file, file_name, pk_location) {
        return new Promise(
            function (fullfill) {
                let file_name_array = file_name.split("_");
                let date = functions.convertDate(file_name_array[0]);
                let hour = functions.convertHour(file_name_array[1]);
                let reg_date = functions.datetime();
                db.query(template(sqlQuery.query_insertFile,{pk_sensor: pk_sensor, path_file: path_file, date: date, hour: hour, reg_date: reg_date, pk_location: pk_location, axis: file_name_array[2]}), function (err, result) {
                    if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error insert", data: null});

                    if(result.affectedRows !== 0){
                        //se registro correctamente
                        fullfill({hcode: 200 ,code: "001", msg:"Registred correct file", data: null});
                    }else{
                        fullfill({hcode: 202 ,code: "002", msg: "Error registred file", data: null});
                    }
                });
            })
    },
    updateFile: function (pk_sensor, path_file, file_name) {
      return new Promise(
          function (fullfill) {
              let file_name_array = file_name.split("_");
              let date = functions.convertDate(file_name_array[0]);
              let hour = functions.convertHour(file_name_array[1]);
              let reg_date = functions.datetime();
              db.query(template(sqlQuery.query_updateFile,{pk_sensor: pk_sensor, path_file: path_file, date: date, hour: hour, reg_date: reg_date, axis: file_name_array[2]}), function (err, result) {
                  if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error update", data: null});

                  if(result.affectedRows !== 0){
                      //se registro correctamente
                      fullfill({hcode: 200 ,code: "001", msg:"Update correct register file", data: null});
                  }else{
                      fullfill({hcode: 202 ,code: "002", msg: "No update correct register file", data: null});
                  }
              });
          }
      )
    },
    verifyExistFile: function (file_name,pk_sensor) {
        return new Promise(
            function (fullfill) {
                let file_name_array = file_name.split("_");
                let date = functions.convertDate(file_name_array[0]);
                let hour = functions.convertHour(file_name_array[1]);
                db.query(template(sqlQuery.query_verifyExistFile,{pk_sensor: pk_sensor, date: date, hour: hour, axis: file_name_array[2]}), function (err, result) {
                    if (err) return fullfill({hcode: 500, code: "005", msg: "Internal error exist file", data: null});

                    if(result[0].counter === 0){
                        //no existe archivo
                        fullfill({hcode: 200 ,code: "001", msg:"No exist file", data: result[0]})
                    }else{
                        //existe archivo
                        fullfill({hcode: 200 ,code: "002", msg:"Exist file", data: result[0]})
                    }
                })
            }
        )
    },
    uploadFiles: function (file,path_file) {
        return new Promise(
            function (fullfill) {
                let new_path = path.join(config.dir_files_data, file.name);
                let file_ext = file.name.split('.').pop();
                let old_path = file.path;
                if(file.type === "text/plain" || file.type === "application/octet-stream") {
                    if(file_ext === "txt" || file_ext === "json" || file_ext === "sac" || file_ext === "SAC") {
                        //no existe el archivo
                        fs.readFile(old_path, function (err, data) {
                           fs.writeFile(`${path_file}/${file.name}`, data, function (err) {
                               console.log(err);
                               if(err) return fullfill({hcode: 500, code: "002", msg: "Not file upload correct", data: null});

                               fs.unlink(old_path, function (err) {
                                   if (err) {
                                       fullfill({hcode: 202, code: "002", msg: "Not file upload correct", data: null});
                                   } else {
                                       fullfill({hcode: 200, code: "001", msg: "Upload File Correct", data: {filePath: `${path_file}/${file.name}`}});
                                   }
                               });
                           });
                         });
                    }else{
                        fullfill({hcode: 202, code: "003", msg: "Incorrect data type", data: null});
                    }
                }else{
                    fullfill({hcode: 202, code: "003", msg: "Incorrect data type", data: null});
                }
            }
        )
    }
};

function fileExists(file, cb) {
    fs.stat(file, function(err, stats){
        if (err) {
            if (err.code === 'ENOENT') {
                return cb(null, false);
            } else { // en caso de otro error
                return cb(err);
            }
        }
        // devolvemos el resultado de `isFile`.
        return cb(null, stats.isFile());
    });
}