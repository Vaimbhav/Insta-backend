const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const Users = require('./models/users');
const Posts = require('./models/posts');
const {isAuth, sanitizeUser, cookieExtractor} = require('./common');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const messageRoutes = require('./routes/messages');

require('dotenv').config();

const PORT = process.env.PORT || 9000;

const server = express();
server.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false, // don't save session if unmodified
		saveUninitialized: false, // don't create session until something stored
		// store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
	})
);

server.use(passport.initialize());
server.use(passport.session());
server.use(passport.authenticate('session'));
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

const connectWithDb = require('./config/database');
connectWithDb();

server.listen(PORT, () => {
	console.log(`App is started at Port no ${PORT}`);
});

server.get('/api/v1', (req, res) => {
	// console.log(req.session);
	res.send(`Why So Serious`);
});

// ? Routes
server.use('/api/v1/auth', authRoutes);
server.use('/api/v1/user', isAuth(), userRoutes);
server.use('/api/v1/post', isAuth(), postRoutes);
server.use('/api/v1/message', isAuth(), messageRoutes);
// Passport Methods

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY;

// Local strategy
passport.use(
	'local',
	new LocalStrategy({usernameField: 'email'}, async function (
		email,
		password,
		done
	) {
		// console.log('here-local');
		// console.log('email- ', email, password);
		try {
			const user = await Users.findOne({email: email}).exec();
			// console.log('user', user);
			if (!user) {
				return done(null, false, {message: 'User Not Registered'});
			}
			const isPasswordValid = await bcrypt.compare(
				password,
				user.password
			);
			const populatedPosts = await Promise.all(
				user.posts.map(async (postId) => {
					const post = await Posts.findById(postId);
					if (post.author.equals(user.id)) {
						return post;
					}
					return null;
				})
			);
			if (isPasswordValid) {
				const token = jwt.sign(
					sanitizeUser(user),
					process.env.SECRET_KEY
				);
				done(
					null,
					{id: user.id, posts: populatedPosts, token},
					{message: 'Logged in Successfully'}
				);
			} else {
				done(null, false, {message: 'Invalid Credentials'});
			}
		} catch (err) {
			done(err);
		}
	})
);

passport.use(
	'jwt',
	new JwtStrategy(opts, async function (jwt_payload, done) {
		try {
			const user = await Users.findById(jwt_payload.id);
			if (user) {
				return done(null, sanitizeUser(user));
			} else {
				return done(null, false);
				// or you could create a new account
			}
		} catch (err) {
			return done(err, false);
		}
	})
);

passport.serializeUser(function (user, cb) {
	// console.log('serialise- ', user);
	process.nextTick(function () {
		return cb(null, sanitizeUser(user));
	});
});

passport.deserializeUser(async function (user, cb) {
	const userInfo = await Users.findById(user.id);
	// console.log('deserialise- ', userInfo);
	process.nextTick(function () {
		return cb(null, userInfo);
	});
});
