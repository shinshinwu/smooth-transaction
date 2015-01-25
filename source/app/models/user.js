var mongoose = require('mongoose');
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
                            last4SSN: {type: String, default: ''}
                          },

  phone                 : {type: String, default: ''},

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

module.exports = mongoose.model('User', userSchema);
