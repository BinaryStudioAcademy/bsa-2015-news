var apiResponse = require('express-api-response');
var PackRepository = require('../../repositories/pack');
var PacksService = require('../../services/packs');


module.exports = function(app) {

	app.get('/api/packs', function(req, res, next){
		PacksService.getPacks(req.decoded, req.query, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.get('/api/packs/:id', function(req, res, next){
		PacksService.getPack(req.params.id, req.decoded, function(err, data){
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.post('/api/packs', function(req, res, next){
		PackRepository.add(req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.put('/api/packs/:id', function(req, res, next){
		PackRepository.update(req.params.id, req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.delete('/api/packs/:id', function(req, res, next){
		PackRepository.delete(req.params.id, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.post('/api/packs/:id/news', function(req, res, next){
		PackRepository.pushNews(req.params.id, req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.delete('/api/packs/:packId/news/:newsId', function(req, res, next){
		PackRepository.removeNews(req.params.packId, req.params.newsId, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);
};
