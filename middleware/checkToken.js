var jsonwebtoken = require('jsonwebtoken');
var Cookies = require('cookies');

module.exports = function(req, res, next){
	var cookies = new Cookies(req, res);
	var token = cookies.get('x-access-token');

	if (token) {
		jsonwebtoken.verify(token, 'superpupersecret', function(err, decoded) {
			if (err) {
				res.status(403).send({ success: false, message: "Failed to authenticate user"});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		var current_url = req.protocol + '://' + 'team.binary-studio.com'; //req.get('host')

		var cookies = new Cookies(req, res);
		cookies.set('referer', current_url);

		res.redirect('http://team.binary-studio.com/auth');
		// res.status(403).send({ success: false, message: "No Token Provided"});
	}
};