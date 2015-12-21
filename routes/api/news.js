var User = require('../../schemas/user.js');
var News = require('../../schemas/news.js');
var apiResponse = require('express-api-response');
var NewsRepository = require('../../repositories/news');
var NewsService = require('../../services/news.js');


module.exports = function(app) {

	app.get('/api/news', function(req, res, next){
		NewsRepository.getAllNews(req.decoded, function(err, data){
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.get('/api/news/:id', function(req, res, next){
		NewsRepository.getNews(req.decoded, req.params.id, function(err, data){
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

	app.get('/api/news/:id/comments', function(req, res, next) {
		NewsRepository.getComments(req.params.id, function(err, data){
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.put('/api/news/:newsId/comments/:commentId', function(req, res, next) {
		/*NewsRepository.update(req.params.newsId, req.params.commentId, req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});*/

		NewsService.toggleCommentlike(req.decoded.id, req.params.newsId, req.params.commentId, function(err, data) {
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
