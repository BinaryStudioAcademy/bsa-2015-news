var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var packSchema = new Schema({
	title: String,
	author: mongoose.Schema.ObjectId,
	date: Number,
	hidden: {
		type: Boolean,
		default: true
	},
	news: {
		type: [mongoose.Schema.ObjectId],
		default: []
	}
});

module.exports = mongoose.model('Pack', packSchema);