'use strict'
const path = require('path')
const local = require('./local')

let config = {
    title: "",
    env: "production",
    port: 3000,
    viewDir: path.join(__dirname,'..','view'),
    logDir: path.join(__dirname,'..', 'log'),
    staticDir: path.join(__dirname,'..', 'public'),
    mongodb: {
        connection: process.env.MONGODB_CONNECTION,
        host: process.env.MONGODB_PORT_27017_TCP_ADDR,        
        port: process.env.MONGODB_PORT_27017_TCP_PORT,
        collection: process.env.MONGODB_INSTANCE_NAME || 'partynow'
    },
    redis: {
        host: 'localhost',
        port: 6379
    },
    secret: 'test',
    TOKEN_EXPIRATION: 60 * 60 * 24
}

//当NODE_ENV环境变量值为local时
//本地调试环境
if(process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development'){
    config = Object.assign(config, local)
}

module.exports = config
