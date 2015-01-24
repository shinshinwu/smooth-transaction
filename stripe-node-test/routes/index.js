var express = require('express');
var router = express.Router();
var secret_key = process.env.TEST_SECRET_KEY

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/', function(req, res) {
    var stripe = require("stripe")(secret_key);

    // (Assuming you're using express - expressjs.com)
    // Get the credit card details submitted by the form
    var stripeToken = req.body.stripeToken;

      // create charge
    var charge =
      {
        amount: 10*100,
        currency: 'USD',
        card: stripeToken
      };
    stripe.charges.create(charge,
        function(err, charge) {
          if (err && err.type === 'StripeCardError') {
            // The card has been declined
          }
        });
    // render congrats page
    res.render('congrats', { charge: charge.amount/100.00});
    }
);

module.exports = router;
