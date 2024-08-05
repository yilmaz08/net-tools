var express = require('express');
var router = express.Router();

router.get('/', function(req, res) { res.render('info'); });
router.get('/port', function(req, res) { res.render('port'); });
router.get('/dns', function(req, res) { res.render('dns'); });
router.get('/rdns', function(req, res) { res.render('rdns'); });
router.get('/traceroute', function(req, res) { res.render('traceroute'); });

module.exports = router;
