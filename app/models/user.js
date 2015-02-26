var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')
var uniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validator');


// validators:


var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Please enter a valid email'
  })
];

var einValidator = [
  validate({
    validator: 'matches',
    arguments: /\d{2}[-]?\d{7}/,
    message: 'Please enter a valid 9 digit EIN'
  })
]

var websiteValidator = [
  validate({
    validator: 'isURL',
    message: 'Please enter a valid website'
  })
]

var zipValidator = [
  validate({
    validator: 'isNumeric',
    message: 'Zipcode can only contain numbers'
  }),
  validate({
    validator: 'isLength',
    arguments: 5,
    message: 'Zipcode must be at least 5 digits'
  })
]

var phoneValidator = [
  validate({
    validator: 'matches',
    arguments: /[(]?\d{3}([-]|[)])?\d{3}[-]?\d{4}\d*/,
    message: 'Phone number must be at least 10 digits'
  })
]

var dayValidator = [
  validate({
    validator: 'matches',
    arguments: /[0-3]{1}\d{1}/,
    message: 'Enter a valid 2 digit day (ex: 01)'
  }),
  validate({
    validator: 'isNumeric',
    message: 'Day must be numeric'
  })
]

var monthValidator = [
  validate({
    validator: 'matches',
    arguments: /[0-1]{1}\d{1}/,
    message: 'Enter a valid 2 digit month (ex: 01)'
  }),
  validate({
    validator: 'isNumeric',
    message: 'Month must be numeric'
  })
]

var yearValidator = [
  validate({
    validator: 'isNumeric',
    message: 'Year must be numeric'
  }),
  validate({
    validator: 'isLength',
    arguments: [4,4],
    message: 'Year must be 4 digits'
  })
]

var ssnValidator = [
  validate({
    validator: 'isNumeric',
    message: 'Last 4 SSN must be numeric'
  }),
  validate({
    validator: 'isLength',
    arguments: [4,4],
    message: 'Last 4 SSN must be 4 digits'
  })
]


// Schema
var userSchema = new mongoose.Schema({

  email                 : {type: String, required: true, unique: true, validate: emailValidator},

  password              : {type: String, required: true},

  orgName               : {type: String, required: true},

  EIN                   : {type: String, validate: einValidator, required: true},

  address               : {
                            street: {type: String, required: true},
                            zip: {type: String, validate: zipValidator, required: true}
                          },

  website               : {type: String, validate: websiteValidator, required: true},

  representative        : {
                            firstName: {type: String, required: true},
                            lastName: {type: String, required: true},
                            DOB: {
                              day: {type: String, validate: dayValidator, required: true},
                              month: {type: String, validate: monthValidator, required: true},
                              year: {type: String, validate: yearValidator, required: true}
                            },
                            SSN: {type: String, validate: ssnValidator, required: true}
                          },

  phone                 : {type: String, validate: phoneValidator, required: true},

  stripe_user_id        : {type: String, default: ''},

  stripe_publishable_key: {type: String, default: ''},

  refresh_token         : {type: String, default: ''},

  access_token          : {type: String, default: ''},

  data                  : {
                            totalEarnings: {type: Number, default: 0},
                            totalDonations: {type: Number, default: 0},
                            topMonth: {
                              time: {type: Date, default: Date.now},
                              amount: {type: Number, default: 0}
                            },
                            topDay: {
                              time: {type: Date, default: Date.now},
                              amount: {type: Number, default: 0}
                            }
                          }
});

userSchema.plugin(uniqueValidator);




// Before save, convert password into bcrypt hash
userSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) {
      return next(err);
    }
    else {
      user.password = hash;
      next();
    }
  });
});

// define method for checking a password against the bcrypt hash
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    else {
      callback(null, isMatch);
    }
  });
}

module.exports = mongoose.model('User', userSchema);
