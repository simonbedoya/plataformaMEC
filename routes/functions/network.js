/**
 * Created by sbv23 on 21/03/2017.
 */
var exec = require('child_process').exec, child;
var config = require('../../config');

exports.remove_folder = function remove_folder(uploadPath) {
         return new Promise( function( fullfill, reject) {

            child = exec(config.remove_w + ' "' + config.dir_files_data + '\\' + uploadPath + '"', function (err, stdout, stderr) {
                if(err === null){
                    fullfill({result: true});
                }else{
                    reject("error");
                }
            });
        });
};



