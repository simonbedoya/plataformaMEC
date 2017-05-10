/**
 * Created by sbv23 on 10/12/2016.
 */
const express = require('express');
const router = express.Router();
const alerController = require('../controller/alert_controller');

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
/* GET home page. */
router.get('/', function(req, res) {
    let sess = req.session;
    alerController.getNetworksByUser(sess.user).then(function (data) {
       if(data.code === "001"){
           let networks = data.data;
           alerController.getSensorByUser(sess.user).then(function (data) {
               if(data.code === "001"){
                   let sensors = data.data;
                    alerController.getListEvents(sess.user).then(function (data) {
                        if(data.code === "001"){
                            res.render('alerts', { user: sess.user, networks: networks, sensors: sensors, events: data.data });
                        }else{
                            res.render('alerts', { user: sess.user, networks: networks, sensors: sensors, events: 0});
                        }
                    })
               }else{
                   res.render('alerts', { user: sess.user, networks: networks, sensors: [], events: [] });
               }
           })
       }else{
           res.render('alerts', { user: sess.user, networks: [], sensors: [], events: [] });
       }
    });

});

module.exports = router;