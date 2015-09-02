var news = require('./news');
var me = require('./me');
var users = require('./users');

module.exports = function(app){
	return {
		news: news(app),
		me: me(app),
		users: users(app)
	};
};