var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	author: {type: mongoose.Schema.ObjectId, ref: 'User'},
	body: String,
	date: Number,
	edited_at: Number,
	likes: [mongoose.Schema.ObjectId]
});

var newsSchema = new Schema({
	title: String,
	body: String,
	type: String,
	author: mongoose.Schema.ObjectId,
	date: Number,
	edited_at: Number,
	comments: {
		type: [commentSchema],
		default: []
	},
	likes: {
		type: [mongoose.Schema.ObjectId],
		default: []
	},
	access_roles: {
		type: [String],
		default: []
	},
	restrict_ids:{
		type: [mongoose.Schema.ObjectId],
		default: []
	}
});

module.exports = {
	model: mongoose.model('News', newsSchema),
	schema: newsSchema
};