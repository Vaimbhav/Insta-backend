// const cloudinary = require('cloudinary').v2;
// require('dotenv').config();

// exports.cloudinaryConnect = () => {
// 	try {
// 		if (
// 			!process.env.CLOUD_NAME ||
// 			!process.env.API_KEY ||
// 			!process.env.API_SECRET
// 		) {
// 			throw new Error('Cloudinary environment variables are missing.');
// 		}

// 		cloudinary.config({
// 			cloud_name: process.env.CLOUD_NAME,
// 			api_key: process.env.API_KEY,
// 			api_secret: process.env.API_SECRET,
// 		});

// 		console.log('Cloudinary connected successfully');
// 	} catch (err) {
// 		console.error('Error connecting to Cloudinary:', err.message);
// 		throw err;
// 	}
// };

const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config({});

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;
