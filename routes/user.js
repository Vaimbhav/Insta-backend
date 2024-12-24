const express = require('express');
const {
	getUser,
	editProfile,
	getSuggestedUsers,
	followOrUnfollow,
} = require('../controllers/user');
// const {isAuth} = require('../common');
const upload = require('../middlewares/multer');

const router = express.Router();

router.get('/:id/profile', getUser);
router.post('/profile/edit', upload.single('profilePicture'), editProfile);
router.get('/suggested', getSuggestedUsers);
router.post('/followorunfollow/:id', followOrUnfollow);

module.exports = router;
