var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({

  email                 : {type: String, required: true, unique: true},

  password              : {type: String, required: true},

  orgName               : {type: String, required: true},

  EIN                   : {type: String, required: true},

  address               : {
                            street: {type: String, required: true},
                            zip: {type: String, required: true}
                          },

  website               : {type: String, required: true},

  representative        : {
                            firstName: {type: String, required: true},
                            lastName: {type: String, required: true},
                            DOB: {
                              day: {type: String, required: true},
                              month: {type: String, required: true},
                              year: {type: String, required: true}
                            },
                            SSN: {type: String, required: true}
                          },

  phone                 : {type: String, required: true},

  stripe_user_id        : {type: String, required: true},

  stripe_publishable_key: {type: String, required: true},

  refresh_token         : {type: String, required: true},

  access_token          : {type: String, required: true},

  data                  : {
                            totalEarnings: {type: Number},
                            totalDonations: {type: Number},
                            topMonth: {type: Date},
                            topDay: {type: Date}
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
