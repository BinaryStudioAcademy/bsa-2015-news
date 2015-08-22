var news = require('./news');
module.exports = function(app){
	return {
		news: news(app)
	};
};