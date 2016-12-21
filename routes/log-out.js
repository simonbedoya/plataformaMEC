/**
 * Created by sbv23 on 10/12/2016.
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
            sess.remember = false;
            sess.user = "";
            res.redirect('admin');
        }
    }else{
        res.redirect('admin');
    }
});

module.exports = router;/**
 * Created by sbv23 on 10/12/2016.
 */
