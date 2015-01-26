var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Q = require('q');

/* GET home page. */
router.get('/', function(req, res) {

  // var id = req.query.id

  // User.findOne({ 'id': id }, function (err, user) {
  //   res.render('index', { publishableKey: user.publishableKey });
  // };

  res.render('index');

});

router.post('/', function(req, res) {

  var publishableKey = req.body.publishableKey;
  var stripeToken = req.body.stripeToken;
  var chargeAmount = parseInt(req.body.amount);
  var name = req.body.name;
  var email = req.body.email;
  var zip = req.body.zip;

  console.log(chargeAmount);

  User.findOne({ 'stripe_publishable_key': publishableKey }, function (err, user) {
      if (err) return handleError(err);
      var stripe = require("stripe")(user.access_token);

      var charge = stripe.charges.create({
        amount: chargeAmount*100, // amount in cents, again
        currency: "usd",
        card: stripeToken,
        metadata: {'email': email, 'zip_code': zip, "name": name}
      }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
          // The card has been declined
        }
      });

    res.render('congrats', { charge: chargeAmount });
  });
    // render congrats page
});

router.get('/id/charges', function(req, res){

  var stripe = require("stripe")(
    "sk_test_7UEs7v3YTK8I0fLBDpWekK6I"
  );

  stripe.charges.list({ limit: 5 }, function(err, charges) {
    // asynchronously called
    res.json(charges)
  });
})

router.get('/balance', function(req, res){

  var stripe = require("stripe")(
    "sk_test_7UEs7v3YTK8I0fLBDpWekK6I"
  );

  stripe.balance.retrieve(function(err, balance) {
    // asynchronously called
    res.json(balance)
  });
})

router.get('/balancehistory', function(req, res){

  var stripe = require("stripe")(
    "sk_test_7UEs7v3YTK8I0fLBDpWekK6I"
  );

  stripe.balance.listTransactions(
    {
      created:
        { gte:1422144000
        }
    }, function(err, transactions) {
    res.json(transactions)
  });
})



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