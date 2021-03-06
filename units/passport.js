var passport = require('passport');
var cnfg = require('../config/');
var LocalStrategy = require('passport-local').Strategy;
var userRepository = require('../repositories/userRepository');

module.exports = function () {

	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		}, function(email, password, done) {
			userRepository.findOne({ email: email }, function(err, user) {
				if (err) { 
					return done(err); 
				}
				
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				
				if (!user.isValidPassword(password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				
				return done(null, user);
			});
		}
	));

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});
 
 
	passport.deserializeUser(function (id, done) {
		userRepository.findOne({id: id}, function(err, user){
			done(err, user);
		});
	});
};