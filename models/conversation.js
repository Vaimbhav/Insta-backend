const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
	participants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
		},
	],
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Messages',
		},
	],
});

module.exports = mongoose.model('Conversations', conversationSchema);
