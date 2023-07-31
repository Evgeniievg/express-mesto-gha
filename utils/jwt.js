const crypto = require('crypto');

module.exports.randomString = crypto.randomBytes(16).toString('hex');
