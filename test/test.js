'use strict';

const Mongorito = require('mongorito');
const User = require('../model/user');
const app = require('../app');
const req = require('supertest')(app.listen());
const test = require('ava');

test.before(function *() {
    yield Mongorito.connect('localhost/mongorito_test');
});

test.after(function *() {
    yield Mongorito.disconnect();
});

test.beforeEach(function *() {
    yield* User.remove();
});

test('get user return 401', t => {
    req
        .get('/user')
        .expect(401, t.end);
});

test('return token', function *(t) {
    let user = new User({ username: 'test', password: 'test'});
    yield* user.save();
    req
        .post('/login')
        .send({
            username: 'test',
            password: 'test'
        })
        .expect(200)
        .end(function(err, res){
            t.is(res.body['msg'], 'Success');
            t.end();
        });    
});

test('create a user', function *(t) {
    let user = new User({ username: 'name', password: 'test' });
    yield* user.save();

    let users = yield User.all();
    t.true(users.length === 1);
});

test('repeat user', function *(t) {
    let user = new User({ username: 'name', password: 'test' });
    yield* user.save();
    
    user = new User({ username: 'name', password: 'test' });
    let err;
    try {
        yield* user.save();
    } catch (e) {
        err = e.message;
    }
    t.is(err, 'User already exist!');
});