var jsonwebtoken = require('jsonwebtoken');
var Cookies = require('cookies');

module.exports = function(app){
	app.get('/api/logout', function(req, res) {
		var current_url = req.protocol + '://' + req.get('host') + req.url;

		var cookies = new Cookies(req, res);
		cookies.set('referer', current_url);
		cookies.set('x-access-token');
		res.redirect('/');
	});

	app.get('/api/me', function(req, res) {
		res.send(req.decoded);
	});
};