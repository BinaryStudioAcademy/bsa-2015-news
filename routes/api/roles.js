var apiResponse = require('express-api-response');
var RoleRepository = require('../../repositories/role');
//var NewsService = require('../../services/news.js');


module.exports = function(app) {

	app.get('/api/roles', function(req, res, next){
		RoleRepository.getAll(function(err, data){
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.post('/api/roles', function(req, res, next){
		RoleRepository.add(req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);

	app.put('/api/roles/:id', function(req, res, next){
		RoleRepository.update(req.params.id, req.body, function(err, data) {
			res.err = err;
			res.data = data;
			next();
		});
	}, apiResponse);
};
