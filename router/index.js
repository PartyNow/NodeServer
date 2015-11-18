const router = require('koa-router')();
const Controller = require('../controller');

router
	.get('/' ,Controller.index)
	.get('/user', Controller.user)
	.post('/register', Controller.register)
	.post('/login', Controller.login)

module.exports = router;
