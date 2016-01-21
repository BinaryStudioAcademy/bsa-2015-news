var RoleRepository = require('../repositories/role');
var UserRepository = require('../repositories/user');

module.exports = {
	isAdmin: isAdmin,
	isContentManager: isContentManager,
	postNews: postNews
};

function isAdmin(req, res, next) {
	if (req.decoded.localRole === 'Admin') {
		next();
	} else {
		return res.sendStatus(403);
	}
}

function isContentManager(req, res, next) {
	if (req.decoded.localRole === 'Admin') {
		next();
	} else {
		if (req.decoded.localRole === 'Content Manager') {
			next();
		} else {
			return res.sendStatus(403);
		}
	}
}

function postNews(req, res, next) {
	if ((req.decoded.localRole === 'User') && (req.body.type !== 'sandbox')) {
		return res.sendStatus(403);
	} else {
		next();
	}
}