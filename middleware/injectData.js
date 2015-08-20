var fs = require('fs');
var replaceStream = require('replacestream');
var User = require('../models/User');

module.exports = function (req, res, next) {

	var obj = {
		user: (new User(req.user)).getViewModel()
	};

	if (res.geo){
		obj.geo = res.geo;
	}

	res.header('Content-Type', 'text/html');
	fs.createReadStream(__dirname + '/../../public/' + '_index.html')
		.pipe(replaceStream('INJECTED_DATA', JSON.stringify(obj)))
		.pipe(res);
};
