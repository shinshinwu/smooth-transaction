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

var phoneValidator = [
  validate({
    validator: 'matches',
    arguments: /[(]?\d{3}([-]|[)])?\d{3}[-]?\d{4}\d*/,
    message: 'Please enter at least a ten digit phone number'
  })
]





// Schema:
var userSchema = new mongoose.Schema({

  email                 : {type: String, required: true, unique: true, validate: emailValidator},

  password              : {type: String, required: true},

  orgName               : {type: String /*required: true*/},

  EIN                   : {type: String, validate: einValidator /*required: true*/},

  address               : {
                            street: {type: String /*required: true*/},
                            zip: {type: String /*required: true*/}
                          },

  website               : {type: String /*required: true*/},

  representative        : {
                            firstName: {type: String /*required: true*/},
                            lastName: {type: String /*required: true*/},
                            DOB: {
                              day: {type: String /*required: true*/},
                              month: {type: String /*required: true*/},
                              year: {type: String /*required: true*/}
                            },
                            SSN: {type: String /*required: true*/}
                          },

  phone                 : {type: String, validate: phoneValidator /*required: true*/},

  stripe_user_id        : {type: String, default: ''},

  stripe_publishable_key: {type: String, default: ''},

  refresh_token         : {type: String, default: ''},

  access_token          : {type: String, default: ''},

  data                  : {
                            totalEarnings: {type: Number},
                            totalDonations: {type: Number},
                            topMonth: {type: Date},
                            topDay: {type: Date}
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
