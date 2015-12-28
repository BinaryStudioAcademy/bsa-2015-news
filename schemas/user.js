var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	global_id: mongoose.Schema.ObjectId,
	local_role: String
});

module.exports = mongoose.model('User', userSchema);