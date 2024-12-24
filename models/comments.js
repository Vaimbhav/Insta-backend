const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
		require: true,
	},
	text: {
		type: String,
		require: true,
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Posts',
		require: true,
	},
});

module.exports = mongoose.model('Comments', commentSchema);
