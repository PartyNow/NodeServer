'use strict';
//应用配置文件
const path = require('path');
const local = require('./local');

let config = {
    title: "",
    env: "production",
    port: 3000,
    viewDir: path.join(__dirname,'..','view'),
    logDir: path.join(__dirname,'..', 'log'),
    staticDir: path.join(__dirname,'..', 'public'),
    mongodb: {
        host: '10.10.72.139',
        port: 27017
    },
    redis: {
        host: 'localhost',
        port: 6379
    },
    secret: 'test',
    TOKEN_EXPIRATION: 15
};

//当NODE_ENV环境变量值为local时
//本地调试环境
if(process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development'){
    config = Object.assign(config, local);
}

module.exports = config;
