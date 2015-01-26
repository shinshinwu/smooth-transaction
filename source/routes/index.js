var express = require('express');
var router = express.Router();
// protected client_id and secret_key for our app from Stripe
var client_id = process.env.TEST_CLIENT_ID
var secret_key = process.env.TEST_SECRET_KEY
// require user model
var User = require('../app/models/user')
var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';
var TOKEN_URI = 'https://connect.stripe.com/oauth/token'
// using node package qs for querystring parsing and stringifying
var qs = require('qs');
// using request for HTTP client, similar to HTTParty
var request = require('request');

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

router.get('/users/authorize', function(req, res){
  res.redirect(AUTHORIZE_URI + '?' + qs.stringify({
    response_type: 'code',
    scope: 'read_write',
    client_id: client_id
  }));
});

router.get('/users/oath/callback', function(req, res){
  var userId = req.session.user_id
  var code = req.query.code;

  request.post({
    url: TOKEN_URI,
    form: {
      grant_type: 'authorization_code',
      client_id: client_id,
      code: code,
      client_secret: secret_key
    }
  }, function(err, r, body){

    if (err)
      res.send(err)

    var stripeUserId = JSON.parse(body).stripe_user_id;
    var stripePublishableKey = JSON.parse(body).stripe_publishable_key;
    var refreshToken = JSON.parse(body).refresh_token;
    var accessToken = JSON.parse(body).access_token;

    getUser(userId,
      // if error....
      function(err) {
        console.log(err);
    },
      // if successful
      function(user) {
        console.log(user)
    });

    //need write to existing user and not create new user!!
    // User.create({
    //   stripe_user_id: stripeUserId,
    //   stripe_publishable_key: stripePublishableKey,
    //   refresh_token: refreshToken,
    //   access_token: accessToken
    // }, function(err, user){
    //   if (err)
    //     res.send(err);

    //   var new_user;

    //   User.findOne({ 'stripe_user_id': stripeUserId }, function (err, user) {
    //     if (err) return handleError(err);
    //     console.log("I get called first")
    //     new_user = user;
    //     res.render('success_oauth', { user: new_user } );
    //   });


    // });
  });
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
