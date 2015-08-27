module.exports = function(app){
	app.get('/api/me', function(req, res) {
		res.send(req.decoded);
	});
};