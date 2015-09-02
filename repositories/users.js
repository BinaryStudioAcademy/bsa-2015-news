var Repository = require('../units/Repository');
var User = require('../schemas/user');

var NewsRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = User;
};

NewsRepository.prototype = new Repository();
/*NewsRepository.prototype.getAllUsers = function(callback) {
	News.find().exec(callback);
};*/
module.exports = new NewsRepository();
