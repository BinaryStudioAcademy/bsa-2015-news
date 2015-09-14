var news = require('./news');
var me = require('./me');

module.exports = function(app){
	return {
		news: news(app),
		me: me(app),
	};
};