var news = require('./news');
var me = require('./me');
var users = require('./users');
var roles = require('./roles');
var packs = require('./packs');

module.exports = function(app){
	return {
		news: news(app),
		me: me(app),
		users: users(app),
		roles: roles(app),
		packs: packs(app)
	};
};