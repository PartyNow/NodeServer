'use strict'
const User = require('../model/user')
const config = require('../config/config')
const util = require('../util')
const jwt = require('../middleware/jwt')
const validator = require('validator')

function* login(next) {
    const req = this.request.body,
          username = validator.trim(req.username),
          password = validator.trim(req.password)
    if(validator.isNull(username) || validator.isNull(password)) {
        this.throw(400, 'Illegal')
    } else {
        const user = yield* User.findOne({ 'username': username })
        if(user && user.get('password') === util.sha256(password)) {
            this.body = {
                token: jwt.sign({ id: user.get('id'), username: user.get('username') }, config.secret, { expiresIn: config.TOKEN_EXPIRATION })
            }
        } else {
            this.throw(400, 'Illegal')
        }
    }
}

module.exports = login
