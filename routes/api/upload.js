/**
 * Created by sbv23 on 16/03/2017.
 */

var express = require('express');
var router = express.Router();
var db = require('../../db/connection');
var response = require('../../message');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var functions = require('../../functions');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

// Upload route.
router.use(function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

        // `file` is the name of the <input> field of type `file`
        if(files.file.type == "text/plain" || files.file.type == "application/octet-stream") {
            var old_path = files.file.path,
                file_size = files.file.size,
                file_ext = files.file.name.split('.').pop(),
                index = old_path.lastIndexOf('\\') + 1,
                file_name = old_path.substr(index),
                new_path = path.join(config.dir_files_data, files.file.name);
            if(file_ext == "txt" || file_ext == "json") {
                fileExists(new_path,function (err,exists) {
                   if(err){
                       res.status(500).send(JSON.parse(response.msg("004", "Internal Error ", "null")));
                   }else{
                        if(exists){
                            //existe el archivo
                            fs.unlink(old_path, function (err) {
                                if (err) {
                                    res.status(500).send(JSON.parse(response.msg("004", "Internal Error ", "null")));
                                } else {
                                    res.status(202).send(JSON.parse(response.msg("004", "Already file exists", "null")));
                                }
                            });
                        }else{
                            //no existe el archivo
                            fs.readFile(old_path, function (err, data) {
                                fs.writeFile(new_path, data, function (err) {
                                    fs.unlink(old_path, function (err) {
                                        if (err) {
                                            res.status(200).send(JSON.parse(response.msg("002", "Not file upload correct", "null")));
                                        } else {
                                            req.filePath = new_path;
                                            next();
                                        }
                                    });
                                });
                            });
                        }
                   }
                });
            }else{
                res.status(202).send(JSON.parse(response.msg("003", "Incorrect data type", "null")));
            }
        }else{
            res.status(202).send(JSON.parse(response.msg("003", "Incorrect data type", "null")));
        }
    });
});

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

router.post('/file', function (req,res) {
   res.send(req.filePath);
});

module.exports = router;
