const login = require('./login');
const register = require('./register');

function* index(next) {
	this.body = {
		login: 'Hello'
	};
}

function* user(next) {
	this.body = 'Auth';
}

module.exports = {index, login, register, user};
