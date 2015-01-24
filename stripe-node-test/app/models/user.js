var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  stripe_user_id: String,
  stripe_publishable_key: String,
  refresh_token: String,
  access_token: String
});