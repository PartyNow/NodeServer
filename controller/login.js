'use strict';
const User = require('../model/user');
const config = require('../config/config');
const util = require('../util');
const jwt = require('koa-jwt');

function* login(next) {
	const req = this.request.body;
	const user = yield* User.findOne({ 'username': req.username });
	if(user && user.get('password') === util.sha1(req.password)) {
		this.body = {
			Success: true,
			token: jwt.sign({ foo: 'bar' }, config.secret, {expiresIn: config.TOKEN_EXPIRATION })
		}
	} else {
		this.body = {
			Success: false
		};
	}
}

module.exports = login;
