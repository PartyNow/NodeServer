const app = require('koa')();
const router = require('./router');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const config = require('./config/config');
const Mongorito = require('mongorito');

Mongorito.connect('mongodb://localhost/partynow');

app.keys = ['secret'];
app.use(bodyParser());
app.use(jwt({ secret: config.secret }).unless({ path: [/^\/login/, /^\/register/] }));
app.use(router.routes());

app.listen(config.port);
console.log('listening on port %s', config.port);

module.exports = app;
