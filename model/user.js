'use strict';
const Mongorito = require('mongorito');
const Model = Mongorito.Model;

class User extends Model {
	configure () {
        this.before('create', 'checkIfExists');
    }
	
	* checkIfExists (next) {
        let user = yield User.find({ username: this.attributes.username });
		if(user.length == 1)
			throw new Error('User already exist!');

        yield next;
    }
}

module.exports = User;