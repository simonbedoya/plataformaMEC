/**
 * Created by sbv23 on 26/04/2017.
 */
const express = require('express');
const router = express.Router();

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
    const session = req.session;
    res.render('notification', { user: session.user });
});

module.exports = router;