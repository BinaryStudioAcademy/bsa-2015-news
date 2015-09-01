var checkToken = require('../middleware/checkToken.js');

module.exports = function(app){

	app.use(checkToken);

	var view = require('./view/routes')(app);
	var api = require('./api/routes')(app);

}