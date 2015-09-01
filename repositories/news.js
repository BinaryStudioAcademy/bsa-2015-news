var Repository = require('../units/Repository');
var News = require('../schemas/news');

var NewsRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = News;
};

NewsRepository.prototype = new Repository();

NewsRepository.prototype.getAllNews = function(user, callback) {
	console.log(user);
	//var query = user.role === 'ADMIN' ? {} : { access_roles: { $or: [ user.role, { $size: 0 }, { $exists: false } ] } };
	News.find({})
		.populate('author', 'name')
		.populate('comments.author', 'name')
		.sort('-date')
		.exec(callback);
};

module.exports = new NewsRepository();