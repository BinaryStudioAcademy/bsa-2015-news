var User = require('../../schemas/user.js');
var News = require('../../schemas/news.js');
var apiResponse = require('express-api-response');
var NewsRepository = require('../../repositories/news');

module.exports = function (app) {

	app.get('/api/news', function(req, res, next){
		NewsRepository.getAllNews(function(err, data){
			res.data = data;
			res.err = err;
			next();
		});
	}, apiResponse);

	app.post('/api/news', function(req, res){
		News.create(req.body, function(err, created) {
			if (err) throw err;

			res.json(created);
		});
	});

	app.put('/api/news/:id', function(req, res){
		News
			.where({_id: req.params.id})
			.update(req.body, function(err, updated) {
				if (err) throw err;

				res.json(updated);
			});
	});

	app.delete('/api/news/:id', function(req, res){
		News.remove({_id: req.params.id}, function(err, removed) {
			if (err) throw err;

			res.json(removed);
		});
	});
};
