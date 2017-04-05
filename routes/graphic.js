/**
 * Created by sbv23 on 27/12/2016.
 */
const express = require('express');
const router = express.Router();
const graphicController = require('../controller/graphic_controller');


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
    const sess = req.session;
    let serial = req.query.id || '';
    if(serial !== '') {
        graphicController.getDateList(serial).then(function (data) {
            if(data.code === "001") {
                res.render('graphic', {user: sess.user, dateList: data.data, serial: serial});
            }else{
                res.render('graphic', {user: sess.user, dateList: JSON.stringify({empty: "true"}), serial: serial});
            }
        })
    }else{
        res.render('graphic', {user: sess.user, dateList: null, serial: serial});
    }
});

module.exports = router;

