var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
		name: String,
		email: String,
		secretKey: String,
		publishKey: String,
		count: Number
});

module.exports = mongoose.model('User', UserSchema)