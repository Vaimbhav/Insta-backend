const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
		require: true,
	},
	reciever: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
		require: true,
	},
	text: {
		type: String,
		require: true,
	},
});

module.exports = mongoose.model('Messages', messageSchema);
