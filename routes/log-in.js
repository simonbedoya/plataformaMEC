/**
 * Created by sbv23 on 09/12/2016.
 */
var express = require('express');
var router = express.Router();
var db = require('../db/connection');
//var dbDao = require('../db/dbDao');
//var mysql = require('mysql');

/*var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'dbserveriot.cgud7zqnytaf.us-west-2.rds.amazonaws.com',
    user            : 'dbserveriot',
    password        : 'iot12345',
    database        : 'dbserveriot'
});

pool.getConnection(function (err, connection) {
   if(err){
       console.error(err);
   }else{
       //console.log(connection);
       connection.query('SELECT * FROM TBL_USER', function(err, rows, fields) {
           if (err) throw err;

           console.log('The solution is: ', rows[0]);
       });
   }

});*/

/* GET home page. */
router.post('/', function(req, res, next) {
    var sess = req.session;
    if (sess.remember){
        console.log("sesion nula");
    }
    var email = req.body.email;
    var pass = req.body.password;
    var sql = "SELECT count(*) AS counter FROM TBL_USER WHERE EMAIL_USER = '"+email+"' AND PASSWORD_USER = '"+pass+"'";
    db.query(sql,function (err,result) {
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