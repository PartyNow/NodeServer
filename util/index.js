const crypto = require('crypto')

function sha256(str) {
    const md5sum = crypto.createHash('sha256')
    md5sum.update(str)
    return md5sum.digest('hex')
}

module.exports = { sha256 }