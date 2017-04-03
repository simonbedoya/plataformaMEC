/**
 * Created by sbv23 on 09/12/2016.
 */
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    const sess = req.session;

    if (sess.remember){
        if (sess.remember === false){
            //session cerrada
            if (req.query.error !== undefined){
                res.render('login',{msgError: req.query.error});
            }else {
                res.render('login', {msgError: ''});
            }
        }else{
            //session abierta
            res.redirect('index');
        }
    }else{
        //no existe la variable de session
        if (req.query.error !== undefined){
            res.render('login',{msgError: req.query.error});
        }else {
            res.render('login', {msgError: ''});
        }
    }

});

module.exports = router;
