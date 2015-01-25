var express = require('express');
var router = express.Router();
var User = require('../app/models/user')

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/loggedin', function(req, res) {
  res.render('loggedin')
});

router.get('/users', function(req, res) {
  res.render('loggedin')
});

router.post('/users', function(req, res) {
  var email = req.param('email')
  var password = req.param('password')

  User.create({
    email: email,
    password: password
  }, function(err, user) {
    if (err) {
      res.render('index', {error: err})
    }
    else {
      res.render('loggedin', {user: user})
    }
  });

});

module.exports = router;
