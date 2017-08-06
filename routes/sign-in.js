/**
 * Created by sbv23 on 6/08/2017.
 */

var express = require('express');
var router = express.Router();
var db = require('../db/connection');
const sqlQuery = require('../sql/sql_data');
const template = require('es6-template-strings');
const functions = require('../functions');
const data_controller = require('../controller/data_controller');


/* GET home page. */
router.post('/', function(req, res, next) {

    let email = req.body.email;
    let name = req.body.user;
    let pass = req.body.pass;
    let term = req.body.term;

    if(term === undefined){
        let string = encodeURIComponent('Debe aceptar terminos y condiciones');
        return res.redirect('register?error=' + string);
    }else if(!functions.validatePass(pass)) {
        let string = encodeURIComponent('La contraseña debe contener 1 digito, 1 letra');
        return res.redirect('register?error=' + string);
    }

    data_controller.existEmail(email).then(function (data) {
       if(data.code === "002"){
           let string = encodeURIComponent('El correo electrónico ingresado ya esta registrado');
           return res.redirect('register?error=' + string);
       } else if(data.code === "001"){
           db.query(template(sqlQuery.query_signin, {name: name, email: email, pass: pass, date: functions.datetime()}), function (err, result) {
               console.log(result);
               if (err) {
                   let string = encodeURIComponent('Problemas con el servidor');
                   return res.redirect('register?error=' + string);
               }

               return res.redirect('admin');

           });
       }
    });




/*
    var sess = req.session;
    if (sess.remember){
        console.log("sesion nula");
    }
    var email = req.body.email;
    var pass = req.body.password;
    if(!functions.validatePass(pass)){
        let string = encodeURIComponent('Email o contraseñas incorrectos');
        return res.redirect('admin?error=' + string);
    }else {

        db.query(template(sqlQuery.query_login, {email: email, pass: pass}), function (err, result) {
            console.log(result);
            if (err) {
                var string = encodeURIComponent('Problemas con el servidor');
                res.redirect('admin?error=' + string);
            }
            if (result[0].counter === 0) {
                var string = encodeURIComponent('Email o contraseñas incorrectos');
                res.redirect('admin?error=' + string);
            } else {
                sess.remember = true;
                sess.user = email;
                res.redirect('index')
            }
        });
    }
*/
    //res.redirect('index');
});

module.exports = router;