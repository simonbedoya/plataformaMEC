/**
 * Created by sbv23 on 10/12/2016.
 */
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let sess = req.session;

    res.render('settings', { user: sess.user });
});

module.exports = router;