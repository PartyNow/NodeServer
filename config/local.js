//本地调试环境配置

const config = {
    env: 'local',
    mongodb: {
        connection: '',
        host: 'localhost',        
        port: 27017,
        collection: 'partynow'
    },
    debug: true
}

module.exports = config
