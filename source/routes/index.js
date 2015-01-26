var express = require('express');
var router = express.Router();
var User = require('../app/models/user')

// GET homepage
router.get('/', function(req, res) {
  var err = req.param('err')
  var userId = req.session.user_id

  if (userId) {
    // if logged in, render dashboard page
    getUser(userId,
      // if error....
      function(err) {
        res.redirect('/?err=' + err);
    },
      // if successful
      function(user) {
        res.redirect('/dashboard')
    });
  }
  else {
    // if not logged in render signin page with any errors
    res.render('index', {error: err});
  }
});

// GET signup page
router.get('/signup', function(req, res) {
  var userId = req.session.user_id
  var err = req.param('err')

  if (userId) {
    // if logged in, render dashboard page
    getUser(userId,
      // if error....
      function(err) {
        res.redirect('/signup?err=' + err);
    },
      // if successful
      function(user) {
        res.redirect('/dashboard')
    });
  }
  else {
    // if not logged in render signup page with any errors
    res.render('signup', {error: err});
  }
});

router.get('/loggedin', function(req, res) {
  User.findOne({'_id': req.session.user_id}, function(err, user) {
    if (err) {
      res.redirect('/?err=' + err)
    }
    else {
      res.render('dashboard', {user: user})
    }
  });
});

router.get('/logout', function(req, res) {
  req.session.user_id = ''
  res.redirect('/')
});

router.get('/dashboard', function(req, res) {
  var email = req.param('email');
  var password = req.param('password');
  var userId = req.session.user_id

  if (userId) {
    // if logged in, render dashboard page
    getUser(userId,
      // if error....
      function(err) {
        res.redirect('/?err=' + err);
    },
      // if successful
      function(user) {
        res.render('dashboard', {user: user})
    });
  }
  else {
    User.findOne({ 'email': email }, function(err, user) {
      if (err) {
        res.redirect('/?err=' + err)
      }
      else if (user.password === password) {
        req.session.user_id = user._id
        res.render('dashboard', {user: user})
      }
      else {
        err = 'Invalid email and password!'
        res.redirect('/?err=' + err)
      }
    });
  }
});

router.post('/users', function(req, res) {
  var password = req.param('password');
  var passwordVerify = req.param('passwordVerify');

  if (password === passwordVerify) {
    User.create(req.body, function(err, user) {
      if (err) {
        res.redirect('/?err=' + err)
      }
      else {
        req.session.user_id = user._id
        res.redirect('/')
      }
    });
  }
  else {
    err = "Passwords do not match!"
    res.redirect('/?err=' + err)
  }
});


function getUser(userId, errorCallback, successCallback) {
  User.findOne({'_id': userId}, function(err, user) {
    if (err) {
      errorCallback(err);
    }
    else {
      successCallback(user);
    }
  });
}



module.exports = router;
