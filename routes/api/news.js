var User = require('../../schemas/user.js');
var News = require('../../schemas/news.js');
var apiResponse = require('express-api-response');
var NewsRepository = require('../../repositories/news');

module.exports = function (app) {

	app.get('/api/news', function(req, res, next){
		NewsRepository.getAllNews(req.user, function(err, data){
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.post('/api/news', function(req, res, next){
		NewsRepository.add(req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.put('/api/news/:id', function(req, res, next){
		NewsRepository.update(req.params.id, req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.delete('/api/news/:id', function(req, res, next){
		NewsRepository.delete(req.params.id, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);
};