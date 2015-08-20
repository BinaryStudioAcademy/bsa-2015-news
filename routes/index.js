module.exports = function(app){

	var view = require('./view/routes')(app);
	var api = require('./api/routes')(app);

}