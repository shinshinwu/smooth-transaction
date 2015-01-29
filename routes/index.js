var express = require('express');
var router = express.Router();
var mandrill = require('node-mandrill')('EQdF2EFMRC04ciDfefm1fw');
// var jQuery = require('jquery')
// protected client_id and secret_key for our app from Stripe
var client_id = process.env.TEST_CLIENT_ID
var secret_key = process.env.TEST_SECRET_KEY
var email_key = process.env.EMAIL_KEY
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
    res.render('index', {error: err, layout: 'splash'});
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
          res.render('accountInfo', { layout: 'dashboard',
                                      user: user})
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
  var errorMsg = 'Invalid email and password!'
  var customErr = { "invalid": { message: errorMsg } }

  User.findOne({ 'email': email }, function(err, user) {
    if (err) {
      res.json({errors: err})
    }
    else if (!user) {
      res.json({errors: customErr});
    }
    else {
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          res.json({errors: err})
        }
        else if (isMatch) {
          req.session.user_id = user._id
          res.json({redirect: 'dashboard'})
        }
        else {
          res.json({errors: customErr});
        }
      });
    }
  });
});



// create and login a new user
router.post('/users', function(req, res) {
  var password = req.param('password');
  console.log(password)
  var passwordVerify = req.param('passwordVerify');
  var passLengthErr = { "invalid": { message: 'Password must be at least 8 characters' } }
  var passMatchErr = { "invalid": { message: 'Passwords do not match' } }

  if (!password) {
    res.json({errors: passLengthErr})
  }
  else if (password.length < 8) {
    res.json({errors: passLengthErr})
  }
  else if (password === passwordVerify) {
    User.create(req.body, function(err, user) {
      if (err) {
        console.log(err.errors)
        res.json(err)
      }
      else {
        req.session.user_id = user._id
        res.json({redirect: 'dashboard'})
      }
    });
  }
  else {
    res.json({errors: passMatchErr})
  }
});



// authorize the user with stripe
router.get('/users/authorize', function(req, res){
  var userId = req.session.user_id
  var user = {};

  User.findById(userId, function(err, user){
    if (err){
      res.redirect('/')
    } else {
      user = user;
      res.redirect(AUTHORIZE_URI + '?' + qs.stringify({
        client_id: client_id,
        response_type: 'code',
        scope: 'read_write',
        stripe_landing: "login",
        "stripe_user[email]": user.email,
        "stripe_user[url]": user.website,
        "stripe_user[country]": "US",
        "stripe_user[phone_number]": user.phone,
        "stripe_user[business_name": user.orgName,
        "stripe_user[business_type]": "non_profit",
        "stripe_user[street_address]": user.address.street,
        "stripe_user[zip]": user.address.zip,
        "stripe_user[physical_product]": "false",
        "stripe_user[product_category]": "charity",
        "stripe_user[currency]": "usd"
      }));
    }
  });


});



// callback route after authorization
router.get('/users/oath/callback', function(req, res){

  var userId = req.session.user_id
  console.log(userId)
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

    if (err) {
    res.redirect('/dashboard')
    } else {
      var stripeUserId = JSON.parse(body).stripe_user_id;
      var stripePublishableKey = JSON.parse(body).stripe_publishable_key;
      var refreshToken = JSON.parse(body).refresh_token;
      var accessToken = JSON.parse(body).access_token;

      User.findById(userId, function(err, user){
      if (err){
        res.redirect('/dashboard')
      } else {
          user.stripe_user_id = stripeUserId
          user.stripe_publishable_key = stripePublishableKey
          user.refresh_token = refreshToken
          user.access_token = accessToken
          user.save(function(err){
            res.redirect('/dashboard')
          });
        }
      });
    }

  });
});



// iframe stuff that can be linked on another website

router.get('/iframe', function(req, res) {
  res.render('iframe', {layout: 'splash'})
});


router.post('/iframe', function(req, res) {

  var publishableKey = req.body.publishableKey;
  var stripeToken = req.body.stripeToken;
  var chargeAmount = parseInt(req.body.amount);
  var name = req.body.name;
  var email = req.body.email;
  var zip = req.body.zip;
  

  User.findOne({ 'stripe_publishable_key': publishableKey }, function (err, user) {
      if (err) return handleError(err);

      var stripe = require("stripe")(user.access_token);
      // console.log(user.id)

      // post the charges to Stripe
      var charge = stripe.charges.create({
        amount: chargeAmount*100, // amount in cents, again
        currency: "usd",
        card: stripeToken,
        metadata: {'email': email, 'zip_code': zip, "name": name}
      }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
          res.render('error', {error: err, layout: 'splash'})
        } else {
          // Send receipt for the transaction to their email...

          // find the user in our database and update total earning and number of donation attributes

              User.findById(user.id, function(err, user){
                if (err){
                  res.send(err)
                } else {
                  user.data.totalEarnings += (chargeAmount*100)
                  user.data.totalDonations += 1
                  user.save(function(err){
                    if (err){
                      res.send(err)
                    } else {
                      sendEmail(email, chargeAmount, user.orgName, name);
                      res.render('congrats', { charge: chargeAmount, layout: 'splash' });
                    };
                  });
                }
              });
        }

      });

  });
});

// A sample page that uses the iframe tag produced after Oauth


router.get('/graphs', function(req, res){
  res.render('graphs', {layout: 'dashboard'})
});

router.get('/burritoscape', function(req, res){
  res.render('burritoscape')
})

// Need to write logic to update earnings live
router.get('/orgdata', function(req, res){

  var userId = req.session.user_id

  var now = new Date();
  var startOfDay = (new Date(now.getFullYear(), now.getMonth(), now.getDate()))/1000;
  var startOfMonth = (new Date(now.getFullYear(), now.getMonth()))/1000;

  var org = {};
  var secretKey;

  User.findById(userId, function(err, user){
    if (err){
      res.send(err)
    } else {

      secretKey = user.access_token;
      org.totalEarnings = (user.data.totalEarnings/100);
      org.totalDonations = user.data.totalDonations;

      var stripe = require("stripe")(secretKey);

      // get list of jsons for daily transactions
      stripe.balance.listTransactions(
        {
          created:
            { gte: startOfDay
            }
        }, function(err, transactions) {
        org.dailyTotal = getTotalAmount(transactions);
      });

      // get current balance from account
      stripe.balance.retrieve(function(err, balance) {
        org.currentBalance = (balance.pending[0].amount/100);
      });

      // get list of jsons for monthly transactions
      stripe.balance.listTransactions(
        {
          created:
            { gte: startOfMonth
            }
        }, function(err, transactions) {
        org.monthlyTotal = getTotalAmount(transactions);
        res.render('organizationAnalysis', { org: org, layout: 'dashboard'})
      });


    }
  });

});

function sendEmail(email, amount, org, recipientName){
  console.log('hitting')
  mandrill('/messages/send', {
    message: {
        to: [{email: email, name: 'Jim Rubenstein'}],
        from_email: 'smooth@smooth.com',
        subject: "Receipt for your Smooth Transaction",
        text: "Thank you for donating $"+amount+" to "+org+"! Your donation has been recieved and your cause bolstered. Rejoice! Feel free to drop by and give again any time. We will be around to make your giving as 'smooth' as humanly possible."
    }
  }, function(error, response)
  {
    //uh oh, there was an error
    if (error) console.log( JSON.stringify(error) );

    //everything's good, lets see what mandrill said
    else console.log(response);
  });
};

function getUser(userId, errorCallback, successCallback) {
  User.findOne({'_id': userId}, function(err, user) {
    if (err) {
      errorCallback(err);
    }
    else {
      successCallback(user);
    }
  });
};

// helper methods to iterate through transaction json object returned from stripe to get total amount
function getTotalAmount(jsonList) {
  var count = 0;
  for (i = 0; i < jsonList.data.length; i++) {
    count += jsonList.data[i].amount
  };
  // convert to $$$dollars
  return count/100;
};



module.exports = router;
