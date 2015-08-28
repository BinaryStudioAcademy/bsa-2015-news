var Repository = require('../units/Repository');
var News = require('../schemas/news');

var NewsRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = News;
};

NewsRepository.prototype = new Repository();

NewsRepository.prototype.getAllNews = function(callback) {
	News.find()
		.populate('author', 'name')
		.populate('comments.author', 'name')
		.sort('-date')
		.exec(callback);
};

NewsRepository.prototype.updatwComment = function(newsId, body, callback) {
	News.update({_id: newsId},{$push:{comments: body}})
	.exec(callback);
}
module.exports = new NewsRepository();