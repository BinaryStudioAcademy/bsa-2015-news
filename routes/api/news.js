var _ = require('lodash');
var News = require('../../schemas/news').model;
var apiResponse = require('express-api-response');
var NewsRepository = require('../../repositories/news');
var NewsService = require('../../services/news');
var rightsChecker = require('../../middleware/rightsChecker');


module.exports = function(app) {

	app.get('/dropAll', function(req, res, next) {
		NewsService.dropAll(function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

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
				NewsRepository.getComments(req.params.newsId, function(err, data) {
					var comment = _.find(data.comments, function(comm) {
						return comm._id == req.params.commentId;
					});
					if (!comment || (comment.author != req.decoded.id)) {
						return res.sendStatus(403);
					} else {
						NewsRepository.editComment(req.decoded.id, req.params.commentId, req.body.body, function(err, data) {
							res.err = err;
							res.data = data;
							next();
						});
					}
				});
			} else {
				NewsRepository.editComment(req.decoded.id, req.params.commentId, req.body.body, function(err, data) {
					res.err = err;
					res.data = data;
					next();
				});
			}
		}
	}, apiResponse);

	app.delete('/api/news/:newsId/comments/:commentId', function(req, res, next) {
		if (req.decoded.localRole === 'User') {
			NewsRepository.getComments(req.params.newsId, function(err, data) {
				var comment = _.find(data.comments, function(comm) {
					return comm._id == req.params.commentId;
				});
				if (!comment || (comment.author != req.decoded.id)) {
					return res.sendStatus(403);
				} else {
					NewsRepository.deleteComment(req.params.commentId, function(err, data) {
						res.err = err;
						res.data = data;
						next();
					});
				}
			});
		} else {
			NewsRepository.deleteComment(req.params.commentId, function(err, data) {
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
				} else {
					NewsRepository.update(req.params.id, req.body, function(err, data) {
						res.err = err;
						res.data = data;
						next();
					});
				}
			});
		} else {
			NewsRepository.update(req.params.id, req.body, function(err, data) {
				res.err = err;
				res.data = data;
				next();
			});
		}
	}, apiResponse);

	app.delete('/api/news/:id', function(req, res, next) {
		if (req.decoded.localRole === 'User') {
			NewsRepository.getNews(req.decoded, req.params.id, function(err, data){
				res.err = err;
				if (!data || (data.author !== req.decoded.id)) {
					return res.sendStatus(403);
				} else {
					NewsRepository.delete(req.params.id, function(err, data) {
						res.err = err;
						res.data = data;
						next();
					});
				}
			});
		} else {
			NewsRepository.delete(req.params.id, function(err, data) {
				res.err = err;
				res.data = data;
				next();
			});
		}
	}, apiResponse);

	app.post('/api/news/:newsId/likes', function(req, res, next) {
		NewsRepository.likeNews(req.decoded.id, req.params.newsId, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.delete('/api/news/:newsId/likes', function(req, res, next) {
		NewsRepository.dislikeNews(req.decoded.id, req.params.newsId, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.post('/api/news/:newsId/comments/:commentId/likes', function(req, res, next) {
		NewsRepository.likeComment(req.decoded.id, req.params.newsId, req.params.commentId, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.delete('/api/news/:newsId/comments/:commentId/likes', function(req, res, next) {
		NewsRepository.dislikeComment(req.decoded.id, req.params.newsId, req.params.commentId, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);
};
