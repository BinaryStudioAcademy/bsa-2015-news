var Repository = require('../units/Repository');
var User = require('../schemas/user');

var UserRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = User;
};

UserRepository.prototype = new Repository();

UserRepository.prototype.findGlobal = function(userGlobalId, callback) {
	User.findOne({global_id: userGlobalId})
		.exec(callback);
};

UserRepository.prototype.drop = function(callback) {
	User.remove({}).exec(callback);
};

module.exports = new UserRepository();