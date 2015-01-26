var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({

  email                 : {type: String, required: true, unique: true},

  password              : {type: String, required: true},

  orgName               : {type: String, default: ''},

  EIN                   : {type: String, default: ''},

  address               : {
                            street: {type: String, default: ''},
                            zip: {type: String, default: ''}
                          },

  website               : {type: String, default: ''},

  representative        : {
                            firstName: {type: String, default: ''},
                            lastName: {type: String, default: ''},
                            DOB: {
                              day: {type: String, default: ''},
                              month: {type: String, default: ''},
                              year: {type: String, default: ''}
                            },
                            SSN: {type: String, default: ''}
                          },

  phone                 : {type: String, default: ''},

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
