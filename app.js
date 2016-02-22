const app = require('koa')()
const router = require('./router')
const bodyParser = require('koa-bodyparser')
const config = require('./config/config')
const Mongorito = require('mongorito')
const error = require('./middleware/error')
// const serve = require('koa-static')

Mongorito.connect(`mongodb://${ config.mongodb.host }:${ config.mongodb.port }/${ config.mongodb.collection }`)

app.use(bodyParser())

// custom error middleware
app.use(error())

// router
app.use(router.routes())

// app.use(serve('public'))

app.listen(config.port)
console.log('listening on port %s', config.port)

module.exports = app
