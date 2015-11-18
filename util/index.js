const crypto = require('crypto');

function sha1(str) {
    const md5sum = crypto.createHash('sha1');
    md5sum.update(str);
    return md5sum.digest('hex');
}

module.exports = { sha1 };