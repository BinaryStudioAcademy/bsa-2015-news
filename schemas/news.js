var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
	subject: String,
	body: String
});

module.exports = mongoose.model('News', newsSchema);