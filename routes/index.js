var express = require('express');
var router = express.Router();
var db = require('../db/connection');

/* GET home page. */
router.get('/', function(req, res, next) {
  var sess = req.session;
  var nets = 0;
  var sensors = 0;
  var alerts = 0;
  var errors = 0;
    if (sess.remember){
      if (sess.remember == false){
        //sesion cerrada
        res.redirect('admin');
      }else{
        //session iniciada
        var sql = "SELECT count(*) AS NETS FROM TBL_NETWORK WHERE EMAIL_USER = '"+sess.user+"'";
        db.query(sql, function (err, result) {
            if (err){
              console.log("Error consulta numero de redes");
            }
            if(result.length != 0){
              nets = result[0].NETS;
              sql = "SELECT count(*) AS SENSORS FROM TBL_SENSOR INNER JOIN TBL_NETWORK ON TBL_SENSOR.PK_NETWORK = TBL_NETWORK.PK_NETWORK WHERE EMAIL_USER = '"+sess.user+"' AND STATUS_SENSOR = 'Activo'";
              db.query(sql, function (err, result) {
                  if (err){
                      console.log("Error consulta numero de sensores");
                  }
                  if(result.length != 0){
                      sensors = result[0].SENSORS;
                      /*sql = "SELECT count(*) AS SENSORS FROM TBL_SENSOR INNER JOIN TBL_NETWORK ON TBL_SENSOR.PK_NETWORK = TBL_NETWORK.PK_NETWORK WHERE EMAIL_USER = '"+sess.user+"'";
                      db.query(sql, function (err, result) {

                      })*/
                      res.render('index', { user: sess.user, networks: nets, sensors: sensors });
                  }else{
                      console.log("Error retorno vacion");
                  }
              });
            }else{
              console.log("Error retorno vacion");
            }
            //console.log("llego");
        });

      }
    }else{
      res.redirect('admin');
    }
});

module.exports = router;
