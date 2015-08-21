function dbConnectionHandler() {
	var mongoose = require('mongoose');
	var config = require('../config/');
	mongoose.connect(config.db.uri, config.db.opts);

	mongoose.set('debug', true);
	// mongoose.set('debug', function(collectionName, method, query, doc, options) {
	// 	console.log('QUERY', query);
	// 	console.log('collectionName', collectionName);
	// 	console.log('method', method);
	// 	console.log('doc', doc);
	// });
	this.connection = mongoose.connection;

	mongoose.connection.on('connected', function() {
		this.state = 'connected';
	});

	mongoose.connection.on('error', function(err) {
		this.state = 'disconnected';
	});

	mongoose.connection.on('disconnected', function() {
		this.state = 'disconnected';
	});

	process.on('SIGINT', function() {
		mongoose.connection.close(function() {
			this.state = 'disconnected';
			process.exit(0);
		});
	});

}

module.exports = new dbConnectionHandler();