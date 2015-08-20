module.exports = function(req, res, next) {

	if (req.accepts('html')) {
		// injectData(req, res, {}, true);
	} else if (req.accepts('json')) {
		res.status(404).end();
	}

};