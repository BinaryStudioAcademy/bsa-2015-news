var Repository = require('../units/Repository');
var Notification = require('../schemas/notification');

var NotificaitionRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = Notification;
};

NotificaitionRepository.prototype = new Repository();

NotificaitionRepository.prototype.findByCriteria = function() {

};

module.exports = new NotificaitionRepository();