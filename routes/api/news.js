var _ = require('lodash');
var News = require('../../schemas/news').model;
var apiResponse = require('express-api-response');
var NewsRepository = require('../../repositories/news');
var NewsService = require('../../services/news');
var rightsChecker = require('../../middleware/rightsChecker');


module.exports = function(app) {

	app.get('/api/news', function(req, res, next) {
		NewsRepository.getAllNews(req.decoded, req.query, function(err, data) {
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

	app.post('/api/news', rightsChecker.postNews, function(req, res, next){
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

	app.post('/api/news/:id/comments', function(req, res, next){
		NewsRepository.update(req.params.id, req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.put('/api/news/:newsId/comments/:commentId', function(req, res, next) {
		if (req.body.body) {
			if (req.decoded.localRole === 'User') {
				NewsRepository.getComments(req.params.newsId, function(err, comments) {
					var comment = _.find(comments, {_id: req.params.commentId});
					if (!comment || (comment.author !== req.decoded.id)) {
						return res.sendStatus(403);
					}
				});
			}
			NewsRepository.editComment(req.decoded.id, req.params.commentId, req.body.body, function(err, data) {
				res.err = err;
				res.data = data;
				next();
			});
		}
		else {
			NewsService.toggleCommentlike(req.decoded.id, req.params.newsId, req.params.commentId, function(err, data) {
				res.err = err;
				res.data = data;
				next();
			});
		}
	}, apiResponse);

	app.put('/api/news/:id', function(req, res, next) {
		if (req.decoded.localRole === 'User') {
			NewsRepository.getNews(req.decoded, req.params.id, function(err, data){
				res.err = err;
				if (!data || (data.author !== req.decoded.id)) {
					return res.sendStatus(403);
				}
			});
		}
		NewsRepository.update(req.params.id, req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.delete('/api/news/:id', function(req, res, next) {
		if (req.decoded.localRole === 'User') {
			NewsRepository.getNews(req.decoded, req.params.id, function(err, data){
				res.err = err;
				if (!data || (data.author !== req.decoded.id)) {
					return res.sendStatus(403);
				}
			});
		}
		NewsRepository.delete(req.params.id, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);
};
