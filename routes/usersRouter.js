var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) { // get: voir des choses du base

  res.json('Hello world');

});

module.exports = router;
