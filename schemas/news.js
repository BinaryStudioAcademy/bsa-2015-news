var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	body: String,
	date: Number
});

var newsSchema = new Schema({
	title: String,
	body: String,
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	date: Number,
	comments: [commentSchema],
	likes: [{id: mongoose.Schema.ObjectId}]
});

module.exports = mongoose.model('News', newsSchema);