var apiResponse = require('express-api-response');
var UserRepository = require('../../repositories/user');
//var NewsService = require('../../services/news.js');


module.exports = function(app) {

	app.get('/api/users', function(req, res, next){
		UserRepository.getAll(function(err, data){
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.post('/api/users', function(req, res, next){
		UserRepository.add(req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.put('/api/users/:id', function(req, res, next){
		UserRepository.update(req.params.id, req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.delete('/api/users/:id', function(req, res, next){
		UserRepository.delete(req.params.id, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);
};
