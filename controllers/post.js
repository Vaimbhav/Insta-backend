const Posts = require('../models/posts');
const Users = require('../models/users');
const Comments = require('../models/comments');

const sharp = require('sharp');
const cloudinary = require('../config/cloudinary');

exports.addNewPost = async (req, res) => {
	try {
		const {body} = req.body;
		const image = req.file;
		const authorId = req.user.id;

		if (!image) {
			return res.status(404).json({
				success: false,
				message: 'Image not found',
			});
		}
		// image upload
		const optimizedImageBuffer = await sharp(image.buffer)
			.resize({width: 800, height: 800, fit: 'inside'})
			.toFormat('jpeg', {quality: 80})
			.toBuffer();

		const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
			'base64'
		)}`;

		const cloudResponse = await cloudinary.uploader.upload(fileUri);

		const post = await Posts.create({
			caption: body,
			author: authorId,
			image: cloudResponse.secure_url,
		});

		const user = await Users.findById(authorId);
		if (user) {
			user.posts.push(post._id);
			await user.save();
		}
		await post.populate({path: 'author', select: '-password'});
		return res.status(201).json({
			success: true,
			message: 'New Post Created',
			post,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getAllPosts = async (req, res) => {
	try {
		const posts = await Posts.find()
			.sort({createdAt: -1})
			.populate({path: 'author', select: 'username, profilePicture'})
			.populate({
				path: 'comments',
				sort: {createdAt: -1},
				populate: {path: 'author', select: 'username, profilePicture'},
			});

		return res.status(200).json({
			success: true,
			message: 'All Posts',
			posts,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getUserPosts = async (req, res) => {
	try {
		const userId = req.user.id;
		const posts = await Posts.find({author: userId})
			.sort({createdAt: -1})
			.populate({path: 'author', select: 'username, profilePicture'})
			.populate({
				path: 'comments',
				sort: {createdAt: -1},
				populate: {path: 'author', select: 'username, profilePicture'},
			});

		return res.status(200).json({
			success: true,
			message: 'User Posts',
			posts,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.likePost = async (req, res) => {
	const likeKarneWaaleKiId = req.user.id;
	const postId = req.params.id;
	const post = await Posts.findById(postId);

	if (!post) {
		return res.status(404).json({
			success: false,
			message: 'Post Not found',
		});
	}

	await post.updateOne({$addToSet: {likes: likeKarneWaaleKiId}});
	await post.save();

	// implement socket.io for real notification

	return res.status(201).json({
		success: true,
		message: 'Post Liked',
	});
};

exports.dislikePost = async (req, res) => {
	const dislikeKarneWaaleKiId = req.user.id;
	const postId = req.params.id;
	const post = await Posts.findById(postId);

	if (!post) {
		return res.status(404).json({
			success: false,
			message: 'Post Not found',
		});
	}

	await post.updateOne({$pull: {likes: dislikeKarneWaaleKiId}});
	await post.save();

	// implement socket.io for real notification

	return res.status(201).json({
		success: true,
		message: 'Post Dis-Liked',
	});
};

exports.addComment = async (req, res) => {
	const postId = req.params.id;
	const post = await Posts.findById(postId);
	const userId = req.user.id;
	const text = req.body;
	if (!text) {
		return res.status(501).json({
			success: false,
			message: 'Text is required',
		});
	}

	const comment = await Comments.create({
		text,
		author: userId,
		post: postId,
	}).populate({
		path: 'author',
		select: 'username, profilePicture',
	});

	post.comments.push(comment._id);
	await post.save();

	return res.status(201).json({
		success: true,
		message: 'Comment Added',
		comment,
	});
};

exports.getCommentsOfPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const comments = await Comments.find({post: postId}).populate(
			'author',
			'username,profilePicture'
		);

		if (!comments) {
			return res.status(401).json({
				success: false,
				message: 'Comments Not Found',
			});
		}

		return res.status(201).json({
			success: true,
			message: 'comments found',
			comments,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user.id;
		const post = await Posts.findById(postId);
		if (!post) {
			return res.status(400).json({
				success: false,
				message: 'Post Not found',
			});
		}

		if (post.author.toString() !== userId) {
			return res.status(400).json({
				success: false,
				message: 'Unauthorized',
			});
		}
		let user = await Users.findById(userId);
		user.posts = user.posts.filter((id) => id.toString() !== postId);
		await user.save();

		await Comments.deleteMany({post: postId});
		return res.status(201).json({
			success: true,
			message: ' Post deleted',
		});
	} catch (error) {
		console.log(error);
	}
};

exports.bookmarkPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user.id;
		const post = await Posts.findById(postId);
		if (!post) {
			return res.status(400).json({
				success: false,
				message: 'Post Not found',
			});
		}

		const user = await Users.findById(userId);

		if (user.bookmarks.includes(post._id)) {
			// Already Bookmark remove from bookmark
			await user.updateOne({$pull: {bookmarks: post._id}});
			await user.save();
			return res.status(200).json({
				success: true,
				message: 'Bookmark Removed',
			});
		} else {
			await user.updateOne({$addToSet: {bookmarks: post._id}});
			await user.save();
			return res.status(200).json({
				success: true,
				message: 'Bookmark Saved',
			});
		}
	} catch (error) {
		console.log(error);
	}
};
