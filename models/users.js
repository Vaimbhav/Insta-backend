const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		username: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			require: true,
		},
		password: {
			type: String,
			require: true,
		},
		gender: {
			type: String,
			enum: ['Male', 'Female', 'Others'],
		},
		phone: {
			type: Number,
		},
		bio: {
			type: String,
			default: '',
		},
		profilePicture: {
			type: String,
			default: '',
		},
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Posts',
			},
		],
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Users',
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Users',
			},
		],
		bookmarks: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Posts',
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Users', userSchema);
