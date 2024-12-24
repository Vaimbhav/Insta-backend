const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
		},
	],
});

module.exports = mongoose.model('Likes', likeSchema);
