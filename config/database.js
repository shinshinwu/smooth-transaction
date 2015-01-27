var dotenv = require('dotenv');
dotenv.load();

var mongoLabUN = process.env.MONGO_LAB_UN
var mongoLabPW = process.env.MONGO_LAB_PW
var localURL = 'mongodb://localhost/smooth_test'
var mongoLabURL

if (mongoLabUN && mongoLabPW) {
  mongoLabURL = 'mongodb://' + mongoLabUN + ':' + mongoLabPW + '@ds053678.mongolab.com:53678/smooth-transaction'
}


module.exports = {
  url : mongoLabURL || localURL
}