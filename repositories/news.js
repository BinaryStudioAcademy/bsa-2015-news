var Repository = require('../units/Repository');
var News = require('../schemas/news');

var NewsRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = News;
};

NewsRepository.prototype = new Repository();

NewsRepository.prototype.getAllNews = function(user, callback) {
	var roleQuery = user.role === 'ADMIN' ? {} : { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] };
	News.find({ $and: [ roleQuery, { restrict_ids: { $nin: [user.id] } } ] })
		.populate('author', 'name')
		.populate('comments.author', 'name')
		.populate('restrict_ids', 'name')
		.sort({date:-1})
		.exec(callback);
};

module.exports = new NewsRepository();
