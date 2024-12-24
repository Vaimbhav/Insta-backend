const express = require('express');
const passport = require('passport');
const {
	createUser,
	logOutUser,
	checkAuth,
	resetPasswordRequest,
	resetPassword,
	loginUser,
} = require('../controllers/auth');

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', passport.authenticate('local'), loginUser);
router.get('/logout', logOutUser);
router.get('/check', passport.authenticate('jwt'), checkAuth);
// router.post('/reset-password-request', resetPasswordRequest);
// router.post('/reset-password', resetPassword);

module.exports = router;
