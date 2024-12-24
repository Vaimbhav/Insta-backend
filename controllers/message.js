const Conversations = require('../models/conversation');
const Messages = require('../models/message');

exports.sendMesssage = async (req, res) => {
	try {
		const senderId = req.user.id;
		const recieverId = req.params.id;
		const message = req.body;
		let conversation = await Conversations.findOne({
			participants: {$all: [senderId, recieverId]},
		});

		if (!conversation) {
			conversation = await Conversations.create({
				participants: [senderId, recieverId],
			});
		}

		const newMessage = await Messages.create({
			sender: senderId,
			reciever: recieverId,
			text: message,
		});

		if (newMessage) {
			Conversations.messages.push(newMessage._id);
		}

		await Promise.all([conversation.save(), newMessage.save()]);

		// Implement Socket.io for real time  messages

		return res.status(201).json({
			success: true,
			newMessage,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getMesssage = async (req, res) => {
	try {
		const senderId = req.user.id;
		const recieverId = req.params.id;
		const conversation = await Conversations.find({
			participants: {$all: [senderId, recieverId]},
		});

		if (!conversation) {
			return res.status(201).json({
				success: true,
				messages: [],
			});
		}

		return res.status(201).json({
			success: true,
			messages: conversation?.messages,
		});
	} catch (error) {
		console.log(error);
	}
};
