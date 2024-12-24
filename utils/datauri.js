// const DataURIParser = require('datauri/parser');
// const path = require('path');

// const parser = new DataURIParser();

// const getDataUri = async (file) => {
// 	console.log('file-> ', file);
// 	if (!file || !file.originalname || !file.buffer) {
// 		throw new Error(
// 			'Invalid file input: originalname or buffer is missing'
// 		);
// 	}
// 	const extName = path.extname(file.originalname).toString();
// 	console.log('ext-name -> ', extName);
// 	const ret = parser.format(extName, file.buffer).content;
// 	console.log('ret-> ', ret);
// 	return ret;
// };

// module.exports = getDataUri;

const DataURIParser = require('datauri/parser');
const path = require('path');

const parser = new DataURIParser();

const getDataUri = (file) => {
	if (!file || !file.originalname || !file.buffer) {
		throw new Error(
			'Invalid file input: originalname or buffer is missing'
		);
	}
	const extName = path.extname(file.originalname).toString();
	const ret = parser.format(extName, file.buffer).content;
	return ret;
};

module.exports = getDataUri;
