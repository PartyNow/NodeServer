'use strict';
const User = require('../model/user');
const util = require('../util');

function* register(next) {
    const req = this.request.body;
    if(!req.username || !req.password) {
        this.body = {
            "msg": "Failed"
        };
        this.status = 400;
    } else {
        const user = new User({
            'username': req.username,
            'password': util.sha1(req.password)
        });
        try {
            yield* user.save();
            this.body = {
                "msg": "Success"
            };
        } catch (e) {
            this.body = {
                "msg": "Exist"
            };
            this.status = 400;
        }
    }
}

module.exports = register;
