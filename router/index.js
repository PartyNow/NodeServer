const router = require('koa-router')({
    prefix: '/api'
})
const Controller = require('../controller')
const jwt = require('../middleware/jwt')
const config = require('../config/config')

router.use(jwt({ secret: config.secret }).unless({ path: [/^\/api\/login/, /^\/api\/register/] }))

router
    .del('/activities/:id', Controller.delActivity)
    .get('/activities', Controller.getActivities)
    .get('/activities/:id', Controller.getActivity)
    .post('/activities', Controller.addActivity)
    .post('/activities/:id', Controller.join)// join and passJoin
    .put('/activities/:id', Controller.like)

router
    .get('/', Controller.index)    
    .get('/profile', Controller.profile)    
    .post('/login', Controller.login)
    .post('/register', Controller.register)
    

module.exports = router
