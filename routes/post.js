const express = require('express');
const upload = require('../middlewares/multer');
const {
	addNewPost,
	getAllPosts,
	getUserPosts,
	likePost,
	dislikePost,
	addComment,
	getCommentsOfPost,
	deletePost,
	bookmarkPost,
} = require('../controllers/post');

const router = express.Router();

router.post('/addpost', upload.single('image'), addNewPost);
router.get('/all', getAllPosts);
router.get('/userpost/all', getUserPosts);
router.post('/:id/like', likePost);
router.post('/:id/dislike', dislikePost);
router.post('/:id/comment', addComment);
router.post('/:id/comment/all', getCommentsOfPost);
router.post('/delete/:id', deletePost);
router.post('/:id/bookmark', bookmarkPost);

module.exports = router;
