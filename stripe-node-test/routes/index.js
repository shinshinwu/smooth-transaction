var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Q = require('q');

/* GET home page. */
router.get('/', function(req, res) {

  var publishableKey = req.query.key;

  res.render('index', { publishableKey: publishableKey });

});

router.post('/', function(req, res) {

  var publishableKey = req.body.publishableKey;
  var stripeToken = req.body.stripeToken;
  var chargeAmount = parseInt(req.body.amount);

  User.findOne({ 'stripe_publishable_key': publishableKey }, function (err, user) {
      if (err) return handleError(err);
      var stripe = require("stripe")(user.access_token);

      var charge = stripe.charges.create({
        amount: chargeAmount*100, // amount in cents, again
        currency: "usd",
        card: stripeToken
      }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
          // The card has been declined
        }
      });

    res.render('congrats', { charge: chargeAmount });
  });
    // render congrats page
});

module.exports = router;


// some q chaining mess in case need for reference later
  // var findUser = function(stripeUserId, error) {
  //   console.log("mongoose");
  //   console.log(stripeUserId);
  //   User.findOne({ 'stripe_user_id': stripeUserID }, function (err, user) {
  //     if (err) return handleError(err);
  //     return user.stripe_publishable_key
  //   });
  // };

  // // console.log(stripeUserID);
  // Q(function() {
  //   var stripeUserId = req.query.id;
  //   console.log("find the id")
  //   return stripeUserId
  // })
  // .call()
  // .then(findUser)
  // .then(function(publishableKey, error){
  //   console.log(publishableKey());
  //   res.render('index', { publishableKey: publishableKey });
  // });

  // User.findOne({ 'stripe_user_id': stripeUserId }, function (err, user) {
  //   if (err) return handleError(err);
  //   res.render('index', { user: user });
  // });