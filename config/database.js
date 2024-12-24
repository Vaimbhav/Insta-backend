const mongoose = require('mongoose');
require('dotenv').config();

const connectWithDb = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log('Db Connected Successfully');
	} catch (error) {
		console.log('Db not conected Sucessfully');
		process.exit(1);
	}
};

module.exports = connectWithDb;
