var express = require('express');
var router = express.Router();
// protected client_id and secret_key for our app from Stripe
var client_id = process.env.TEST_CLIENT_ID
var secret_key = process.env.TEST_SECRET_KEY
// require user model
var User = require('../app/models/user');
var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';
var TOKEN_URI = 'https://connect.stripe.com/oauth/token'

// using node package qs for querystring parsing and stringifying
var qs = require('qs');
// using request for HTTP client, similar to HTTParty
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('users', { clientId: client_id });
});

// some base test for writing to mongodb
router.get('/test', function(req, res){
  res.render('test');
});

router.post('/test', function(req, res){
  console.log(req);
  console.log(res);
  console.log(req.body)
  User.create({
    stripe_user_id: req.body.stripe_user_id,
    access_token: req.body.access_token
  }, function(err, user){
    if (err)
      res.send(err);

    User.find(function(err, users){
      if (err)
        res.send(err)
      res.json(users);
    });
  });
});

router.get('/authorize', function(req, res){
  console.log("I got called!");
  res.redirect(AUTHORIZE_URI + '?' + qs.stringify({
    response_type: 'code',
    scope: 'read_write',
    client_id: client_id
  }));
});

router.get('/oath/callback', function(req, res){
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

    console.log(body);

    var stripeUserID = JSON.parse(body).stripe_user_id;
    var stripePublishableKey = JSON.parse(body).stripe_publishable_key;
    var refreshToken = JSON.parse(body).refresh_token;
    var accessToken = JSON.parse(body).access_token;

    User.create({
      stripe_user_id: stripeUserID,
      stripe_publishable_key: stripePublishableKey,
      refresh_token: refreshToken,
      access_token: accessToken
    }, function(err, user){
      if (err)
        res.send(err);

      User.find(function(err, users){
        if (err)
          res.send(err)
        res.json(users);
      });
    });
  });
});

module.exports = router;
