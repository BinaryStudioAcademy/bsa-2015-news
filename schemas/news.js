var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	body: String,
	date: Number,
	likes: [mongoose.Schema.ObjectId]
});

var newsSchema = new Schema({
	title: String,
	body: String,
	type: String,
	author: mongoose.Schema.ObjectId,
	date: Number,
	comments: [commentSchema],
	likes: [mongoose.Schema.ObjectId],
	access_roles: {
		type: [mongoose.Schema.ObjectId],
		default: []
	},
	restrict_ids:{
		type: [mongoose.Schema.ObjectId],
		default: []
	}

});

module.exports = mongoose.model('News', newsSchema);