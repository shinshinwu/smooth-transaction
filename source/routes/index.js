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

// logout and remove session id info
router.get('/logout', function(req, res) {
  req.session.user_id = '';
  res.redirect('/');
});

// render the dashboard page
router.get('/dashboard', function(req, res) {
  var userId = req.session.user_id;
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
      res.redirect('/')
    }
});

// login an existing user
router.post('/users/login', function(req, res) {
  var email = req.param('email');
  var password = req.param('password');

  User.findOne({ 'email': email }, function(err, user) {
    if (err) {
      res.redirect('/?err=' + err)
    }
    else if (!user) {
      var error = 'Invalid email and password!'
      res.redirect('/?err=' + error)
    }
    else {
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          res.redirect('/?err=' + err)
        }
        else {
          if (isMatch) {
            req.session.user_id = user._id
            res.redirect('/dashboard')
          }
          else {
            var error = 'Invalid email and password!'
            res.redirect('/?err=' + error)
          }
        }
      });
    }
  });

});

// create and login a new user
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
