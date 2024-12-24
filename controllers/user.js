const cloudinary = require('../config/cloudinary');
const Users = require('../models/users');
const getDataUri = require('../utils/datauri');

exports.getUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await Users.findById(userId).select('-password');
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'User not exists',
			});
		}
		return res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: 'Unable To Find User',
		});
	}
};

// exports.editProfile = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		const user = await Users.findById(userId);
// 		console.log('user-> ', user);
// 		if (!user) {
// 			return res.status(400).json({
// 				success: false,
// 				message: 'Login to edit profile',
// 			});
// 		}
// 		const {bio, gender} = req.body;
// 		const profilePicture = req.file;
// 		let cloudResponse;
// 		if (profilePicture) {
// 			console.log('here1');
// 			const fileUri = getDataUri(profilePicture);
// 			console.log('here3');
// 			cloudResponse = await cloudinary.uploader.upload(fileUri);
// 			console.log('here2');
// 		}
// 		if (bio) user.bio = bio;
// 		if (bio) user.gender = gender;
// 		if (profilePicture) user.profilePicture = cloudResponse.secure_url;
// 		await user.save();
// 		return res.status(200).json({
// 			user,
// 			success: true,
// 			message: 'Profile Updated',
// 		});
// 	} catch (error) {
// 		return res.status(200).json({
// 			success: false,
// 			message: 'Unable To Edit Profile',
// 		});
// 	}
// };

exports.editProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await Users.findById(userId).select('-password');
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Login to edit profile',
			});
		}

		const {bio, gender, phone} = req.body;
		const profilePicture = req.file;

		let cloudResponse;
		if (profilePicture) {
			try {
				const fileUri = getDataUri(profilePicture);
				cloudResponse = await cloudinary.uploader.upload(fileUri);
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: 'Failed to upload profile picture',
					error: error.message,
				});
			}
		}
		if (bio) user.bio = bio;
		if (phone) user.phone = phone;
		if (gender) user.gender = gender;
		if (profilePicture) user.profilePicture = cloudResponse.secure_url;

		// Save the updated user data
		await user.save();
		console.log('user');
		// Respond with success and the updated user data
		return res.status(200).json({
			user,
			success: true,
			message: 'Profile Updated Successfully',
		});
	} catch (error) {
		// Catch any unexpected errors and respond
		console.error(error);
		return res.status(500).json({
			success: false,
			message: 'Unable to edit profile',
			error: error.message,
		});
	}
};

exports.getSuggestedUsers = async (req, res) => {
	try {
		const suggestedUsers = await Users.find({
			_id: {$ne: req.user.id},
		}).select('-password');

		if (!suggestedUsers) {
			return res.status(400).json({
				success: false,
				message: 'No Suggested Users',
			});
		}
		return res.status(200).json({
			success: true,
			message: 'Users Found For Suggestions',
			suggestedUsers,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.followOrUnfollow = async (req, res) => {
	try {
		const followKarneWaala = req.user.id;
		const jiskoFollowKarunga = req.params.id;
		if (followKarneWaala === jiskoFollowKarunga) {
			return res.status(400).json({
				success: false,
				message: 'You can not follow/unfollow yourself',
			});
		}

		const user = await Users.findById(followKarneWaala);
		const targetUser = await Users.findById(jiskoFollowKarunga);
		if (!user || !targetUser) {
			return res.status(400).json({
				success: false,
				message: 'Sorry! User Not Found',
			});
		}

		const isFollowing = user.following.includes(jiskoFollowKarunga);
		if (isFollowing) {
			// unfollow
			await Promise.all([
				Users.updateOne(
					{_id: followKarneWaala},
					{$pull: {following: jiskoFollowKarunga}}
				),
				Users.updateOne(
					{_id: jiskoFollowKarunga},
					{$pull: {followers: followKarneWaala}}
				),
			]);
			return res.status(200).json({
				success: true,
				message: 'Unfollowed Succesfully',
			});
		} else {
			// follow
			await Promise.all([
				Users.updateOne(
					{_id: followKarneWaala},
					{$push: {following: jiskoFollowKarunga}}
				),
				Users.updateOne(
					{_id: jiskoFollowKarunga},
					{$push: {followers: followKarneWaala}}
				),
			]);

			return res.status(200).json({
				success: true,
				message: 'Followed Succesfully',
			});
		}
	} catch (error) {
		console.log(error);
	}
};
