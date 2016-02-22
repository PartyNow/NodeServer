module.exports = () => {
    return function *error(next) {
        try {
            yield next;
        } catch (err) {
            this.status = err.status || 500
            this.body = {
                message: err.message
            }

            this.app.emit('error', err, this)
        }
    }
}