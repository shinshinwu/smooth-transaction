var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/users', function(req, res) {
  console.log(req.param)
});

module.exports = router;
