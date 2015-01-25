var express = require('express');
var router = express.Router();
var User = require('../app/models/user')

router.get('/', function(req, res) {
  var err = req.param('err')
  res.render('index', {error: err});
});

router.get('/loggedin', function(req, res) {
  User.findOne({'_id': req.session.user_id}, function(err, user) {
    if (err) {
      res.redirect('/?err=' + err)
    }
    else {
      res.render('loggedin', {user: user})
    }
  });
});

router.get('/logout', function(req, res) {
  req.session.user_id = ''
  res.redirect('/')
});

router.get('/users', function(req, res) {
  var email = req.param('email');
  var password = req.param('password');

  User.findOne({ 'email': email }, function(err, user) {
    if (err) {
      res.redirect('/?err=' + err)
    }
    else if (user.password === password) {
      res.render('loggedin', {user: user})
    }
    else {
      err = 'Invalid email and password!'
      res.redirect('/?err=' + err)
    }
  });
});

router.post('/users', function(req, res) {
  var email = req.param('email');
  var password = req.param('password');
  var passwordVerify = req.param('passwordVerify');

  if (password === passwordVerify) {
    User.create({
      email: email,
      password: password
    }, function(err, user) {
      if (err) {
        res.redirect('/?err=' + err)
      }
      else {
        req.session.user_id = user._id
        res.redirect('/loggedin')
      }
    });
  }
  else {
    err = "Passwords do not match!"
    res.redirect('/?err=' + err)
  }
});

module.exports = router;
