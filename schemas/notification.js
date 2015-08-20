var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
	subject: String,
	body: String
});

module.exports = mongoose.model('Notification', notificationSchema);