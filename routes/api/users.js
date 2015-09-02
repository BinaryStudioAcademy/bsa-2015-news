var UserRepository = require('../../repositories/users');
var apiResponse = require('express-api-response');

module.exports = function (app) {

	app.get('/api/users', function(req, res, next){
		UserRepository.getAll(function(err, data){
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);
};
