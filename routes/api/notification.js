
module.exports = function (app) {

	app.get('/api/notification', function(req, res){
		res.render('index');
	});

};