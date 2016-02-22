'use strict'
const login = require('./login')
const register = require('./register')
const profile = require('./profile')
const activities = require('./activities')

function* index(next) {
    this.throw('name required', 400)
}

module.exports = {
    index,
    login,
    register,
    profile,
    addActivity: activities.addActivity,
    getActivity: activities.getActivity,
    getActivities: activities.getActivities,
    delActivity: activities.delActivity,
    like: activities.like,
    join: activities.join
}
