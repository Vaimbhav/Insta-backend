const express = require('express');
const {sendMesssage, getMesssage} = require('../controllers/message');

const router = express.Router();

router.post('/send/:id', sendMesssage);
router.get('/all/:id', getMesssage);

module.exports = router;
