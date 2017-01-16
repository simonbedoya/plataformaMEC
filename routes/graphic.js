/**
 * Created by sbv23 on 27/12/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session;
    if (sess.remember){
        if (sess.remember == false){
            //sesion cerrada
            res.redirect('admin');
        }else{
            //session iniciada
            res.render('graphic', { user: sess.user });
        }
    }else{
        res.redirect('admin');
    }
});

module.exports = router;