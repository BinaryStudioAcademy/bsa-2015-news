var jsonwebtoken = require('jsonwebtoken');
var Cookies = require('cookies');
var RoleRepository = require('../repositories/role');
var UserRepository = require('../repositories/user');

module.exports = function(req, res, next){
	var cookies = new Cookies(req, res);
	var token = cookies.get('x-access-token');

	if (token) {
		jsonwebtoken.verify(token, 'superpupersecret', function(err, decoded) {
			if (err) {
				res.status(403).send({ success: false, message: "Failed to authenticate user"});
			} else {
				req.decoded = decoded;
				if (req.decoded.role === 'ADMIN') {
					req.decoded.localRole = 'Admin';
					next();
				}
				else {
					UserRepository.findGlobal(req.decoded, function(err, data) {
						if (data) {
							req.decoded.localRole = data.local_role;
							next();
						}
						else {
							RoleRepository.findGlobal(req.decoded.role, function(err, data) {
								if (data) {
									req.decoded.localRole = data.local_role;
									next();
								}
								else {
									req.decoded.localRole = 'User';
									next();
								}
							});
						}
					});
				}
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