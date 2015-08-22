
module.exports = function (app) {

	app.get('/api/news', function(req, res){
		res.render('index');
	});

};