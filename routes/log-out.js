/**
 * Created by sbv23 on 10/12/2016.
 */
const express = require('express');
const router = express.Router();

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
