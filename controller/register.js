'use strict';
const User = require('../model/user');
const util = require('../util');

function* register(next) {
    const req = this.request.body,
          username = req.username,
          password = req.password,
          userReg = /^[a-zA-Z][A-Za-z0-9_]{4,15}$/,
          passReg = /^[A-Za-z0-9_]{8,30}$/;// /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    if(!username || typeof username !== 'string' || !userReg.test(username) || !password || typeof password !== 'string' || !passReg.test(password)) {
        this.body = {
            msg: "Illegal"
        };
        this.status = 400;
    } else {
        const user = new User({
            username,
            password: util.sha1(password)
        });
        try {
            yield* user.save();
            this.body = {
                msg: "Success"
            };
        } catch (e) {
            this.body = {
                msg: "Exist"
            };
            this.status = 400;
        }
    }
}

module.exports = register;
