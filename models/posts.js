const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
		require: true,
	},
	image: {
		type: String,
		require: true,
	},
	caption: {
		type: String,
		default: '',
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
		},
	],
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comments',
		},
	],
});

module.exports = mongoose.model('Posts', postSchema);
