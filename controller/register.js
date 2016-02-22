'use strict'
const User = require('../model/user')
const util = require('../util')
const shortid = require('shortid')
const config = require('../config/config')
const jwt = require('../middleware/jwt')
const validator = require('validator')

function* register(next) {
    const req = this.request.body,
          username = req.username,
          password = req.password,
          email = req.email
          // userReg = /^[a-zA-Z][A-Za-z0-9_]{4,15}$/,
          // passReg = /^[A-Za-z0-9_]{8,30}$/// /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/

    if(!validator.matches(username, /^[a-zA-Z][A-Za-z0-9_]{4,15}$/)
        || !validator.isEmail(email)
        || !validator.matches(password, /^[A-Za-z0-9_]{8,30}$/)) {
        this.throw(400, 'Illegal')
    } else {
        const sid = shortid.generate()
        const user = new User({
            id: sid,
            username,
            email,
            password: util.sha256(password)
        })
        try {
            yield* user.save()
            this.body = {
                message: "success",
                token: jwt.sign({ id: sid }, config.secret, { expiresIn: config.TOKEN_EXPIRATION })
            }
        } catch (e) {
            this.throw(400, 'Exist')
        }
    }
}

module.exports = register
