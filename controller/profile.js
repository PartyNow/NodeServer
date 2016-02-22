'use strict'
const User = require('../model/user')
const Activity = require('../model/activity')
const R = require('ramda')

function* profile(next) {
    const id = this.state.user.id
    const user = yield* User.findOne({ id: id })
    if(user) {
        const pickList = ['id', 'username', 'email']
        const re = R.pick(pickList, user.attributes)

        const activities = yield* Activity.where('owner', id).find()
        const participate = yield* Activity.where('participator', id).find()
        const pendingList = yield* Activity.where('pendingList', id).find()

        re.activities = activities.map(v => v.get('id'))
        re.participate = participate.map(v => v.get('id'))
        re.pendingList = pendingList.map(v => v.get('id'))

        this.body = re
    } else {
        this.throw(400, 'unknow')
    }
}

module.exports = profile
