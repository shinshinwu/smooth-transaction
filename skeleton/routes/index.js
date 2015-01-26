var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

var User = require('../app/models/user')

mongoose.connect('mongodb://localhost/stripe_test')

// console.log(User)


/* GET home page. */

router.use(function(req, res, next){
	console.log('Something is happening...');
	next()
})


router.get('/thing', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/form', function(req, res){
	res.render('form')
})

router.post('/users', function(req, res){

		var user = new User();
		user.name = req.body.name;
		user.email = req.body.email;
		user.secretKey = req.body.secretKey
		user.publishKey = req.body.publishKey
		console.log(user)

		user.save(function(err){
			if (err)
				res.send(err);

			res.json({message: 'User Created!'})
		});
	});

router.get('/users', function(req, res){
	User.findOne(({name: "Kevin"}), function(err, users){

		if (err)
			res.send(err);
		res.json(users)
		});
	});

// router.get('/thing', function(req, res){
// 	res.render('iFrame');
// 	console.log('shit')
// })



// router.get('/database', function(req, res){
// 	console.log('it did it')

// 	mongoose.connect('mongodb://localhost/dildos')
// 	db = mongoose.connection

// 	db.on('error', console.error.bind(console, 'connection error:'));
// 	db.once('open', function(){

// 		var userSchema = mongoose.Schema({
// 			name: String,
// 			email: String,
// 			secretKey: String,
// 			publishKey: String,
// 			count: Number
// 		});

// 		var createUser = function(name, email, secretKey, publishKey){
// 			User = mongoose.model("User", userSchema)
// 			var new_user = new User({name: name, email: email, secretKey: secretKey, publishKey: publishKey, count: 0})
// 			new_user.save(function(err, new_user){
// 				console.log(new_user)
// 			})
// 		}

// 		createUser("Dick Charles", "floppydong@yahoo.com", "abc123", "qwerty1234");

// 			User.findOne({ name: 'Dick Charles' }, function(err, user){
// 				console.log(user);
// 				mongoose.connection.close(console.log('closing...'))
// 			})

// 	})
// })

console.log('hitting?')

module.exports = router;
