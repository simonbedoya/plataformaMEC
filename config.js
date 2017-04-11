/**
 * Created by sbv23 on 07/12/2016.
 */
let path = require('path');

let varGlobals = {
    email_user: '',
    token_user: '',
    secret: "a4f8071f-c873-4447-8ee2",
    dir_files_data: path.join(__dirname, 'uploads'),
    remove_w: "rd /S /Q",
    remove_l: "rm -r",
    url_server: "https://plataformamec.com"

};

module.exports = varGlobals;