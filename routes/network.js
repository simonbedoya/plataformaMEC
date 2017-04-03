/**
 * Created by sbv23 on 10/12/2016.
 */
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    const session = req.session;
    res.render('network', { user: session.user });
});

module.exports = router;