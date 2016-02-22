'use strict'
const assert   = require('assert')
const thunkify = require('thunkify')
const _JWT     = require('jsonwebtoken')
const unless   = require('koa-unless')

const JWT = {decode: _JWT.decode, sign: _JWT.sign, verify: thunkify(_JWT.verify)}

module.exports = (opts) => {
    opts = opts || {}
    opts.key = opts.key || 'user'

    let middleware = function *jwt(next) {
        let token, msg, user, parts, scheme, credentials, secret

        if (this.header.authorization) {
            parts = this.header.authorization.split(' ')
            if (parts.length == 2) {
                scheme = parts[0]
                credentials = parts[1]

                if (/^Bearer$/i.test(scheme)) {
                    token = credentials
                }
            } else {
                this.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"\n')
            }
        } else {
            this.throw(401, 'No Authorization header found\n')
        }

        secret = (this.state && this.state.secret) ? this.state.secret : opts.secret
        if (!secret) {
            this.throw(401, 'Invalid secret\n')
        }

        try {
            user = yield JWT.verify(token, secret, opts)
        } catch(e) {
            msg = 'Invalid token' + (opts.debug ? ' - ' + e.message + '\n' : '\n')
        }

        if (user) {
            this.state = this.state || {}
            this.state[opts.key] = user
            yield next
        } else {
            this.throw(401, msg)
        }
    }

    middleware.unless = unless

    return middleware
}

module.exports.sign   = _JWT.sign
module.exports.verify = _JWT.verify
module.exports.decode = _JWT.decode