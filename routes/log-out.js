/**
 * Created by sbv23 on 10/12/2016.
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
    let sess = req.session;
    sess.remember = false;
    sess.user = "";
    res.redirect('admin');
});

module.exports = router;/**
 * Created by sbv23 on 10/12/2016.
 */
