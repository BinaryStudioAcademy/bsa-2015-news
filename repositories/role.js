var Repository = require('../units/Repository');
var Role = require('../schemas/role');

var RoleRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = Role;
};

RoleRepository.prototype = new Repository();

RoleRepository.prototype.findGlobal = function(globalRole, callback) {
	Role.findOne({global_role: globalRole})
		.exec(callback);
};

RoleRepository.prototype.drop = function(callback) {
	Role.remove({}).exec(callback);
};

module.exports = new RoleRepository();