var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = new Schema({
	local_role: String,
	global_role: String
});

module.exports = mongoose.model('Role', roleSchema);