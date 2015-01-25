var express = require('express');
var router = express.Router();

/* Route to handle all angular requests */
router.get('*', function(req, res) {
  res.render('index');
});

module.exports = router;
