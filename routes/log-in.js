/**
 * Created by sbv23 on 09/12/2016.
 */
var express = require('express');
var router = express.Router();
var db = require('../db/connection');
const sqlQuery = require('../sql/sql_data');
const template = require('es6-template-strings');
const functions = require('../functions');

/* GET home page. */
router.post('/', function(req, res, next) {
    var sess = req.session;
    if (sess.remember){
        console.log("sesion nula");
    }
    var email = req.body.email;
    var pass = req.body.password;
    if(!functions.validatePass(pass)){
        let string = encodeURIComponent('Email o contraseñas incorrectos');
        return res.redirect('admin?error=' + string);
    }

    db.query(template(sqlQuery.query_login,{email: email, pass:pass}),function (err,result) {
        console.log(result[0].counter);
        if (err){
            var string = encodeURIComponent('Problemas con el servidor');
            res.redirect('admin?error=' + string);
        }
        if (result[0].counter == 0){
            var string = encodeURIComponent('Email o contraseñas incorrectos');
            res.redirect('admin?error=' + string);
        }else {
            sess.remember = true;
            sess.user = email;
            res.redirect('index')
        }
    });

    //res.redirect('index');
});

module.exports = router;