const express = require('express');
const router = express.Router();
const db = require('../db/connection');

/* GET home page. */
//verificar session iniciada
router.use(function (req,res,next) {
    const session = req.session;
    if (session.remember){
        if (session.remember === false){
            //sesion cerrada
            res.redirect('admin');
        }else{
            //session iniciada
            next();
        }
    }else{
        res.redirect('admin');
    }
});

router.get('/', function(req, res, next) {
  const sess = req.session;
  let nets = 0;
  let sensors = 0;
  let alerts = 0;
  let errors = 0;

  let sql = "SELECT count(*) AS NETS FROM TBL_NETWORK WHERE EMAIL_USER = '"+sess.user+"'";
  db.query(sql, function (err, result) {
        if (err){
            console.log("Error consulta numero de redes");
        }
        if(result.length !== 0){
            nets = result[0].NETS;
            sql = "SELECT count(*) AS SENSORS FROM TBL_SENSOR INNER JOIN TBL_NETWORK ON TBL_SENSOR.PK_NETWORK = TBL_NETWORK.PK_NETWORK WHERE EMAIL_USER = '"+sess.user+"' AND STATUS_SENSOR = 'Activo'";
            db.query(sql, function (err, result) {
                if (err){
                    console.log("Error consulta numero de sensores");
                }
                if(result.length !== 0){
                    sensors = result[0].SENSORS;
                    sql = "SELECT count(*) AS ALERTS FROM TBL_EVENTS INNER JOIN TBL_SENSOR ON TBL_EVENTS.PK_SENSOR = TBL_SENSOR.PK_SENSOR INNER JOIN TBL_NETWORK ON TBL_SENSOR.PK_NETWORK = TBL_NETWORK.PK_NETWORK WHERE EMAIL_USER = '"+sess.user+"' AND STATUS_SENSOR = 'Activo'";
                    db.query(sql, function (err, result) {
                        if (err){
                            console.log("Error consulta numero de sensores");
                        }
                        if(result.length !== 0){
                            alerts = result[0].ALERTS;

                            res.render('index', { user: sess.user, networks: nets, sensors: sensors, alerts: alerts, errors: errors });
                        }else{
                            console.log("Error retorno vacion");
                        }
                    });
                }else{
                    console.log("Error retorno vacion");
                }
            });
        }else{
            console.log("Error retorno vacion");
        }
        //console.log("llego");
    });
});

module.exports = router;
