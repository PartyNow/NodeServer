'use strict'
const Activity = require('../model/activity')
const User = require('../model/user')
const shortid = require('shortid')
const validator = require('validator')
const R = require('ramda')

// TODO defense xss 和 字数限制
function* addActivity(next) {
    const req = this.request.body,
          userid = this.state.user.id,
          username = this.state.user.username,
          isPublic = validator.toBoolean(req.public || ''),
          title = req.title,
          description = req.description
    
    if(validator.isNull(title) || validator.isNull(description)) {
        this.throw(400, 'param error')
    }

    const sid = shortid.generate()
    const activity = new Activity({
        id: sid,
        owner: userid,
        ownername: username,
        date: +new Date,
        title,
        description,
        like: [],
        public: isPublic,
        participator: [],
        pendingList: []
    })

    try {
        yield* activity.save()
        this.body = {
            success: true,
            id: sid
        }
    } catch (e) {
        this.throw('Internal Server Error')
        console.log(e.message)
    }
}

function* getActivities(next) {
    const activities = yield* Activity.find({})
    const pickList = ['id', 'owner', 'date', 'title', 'description', 'like']
    this.body = {
        activities: activities.map(v => R.pick(pickList, v.attributes))
    }
}

// TODO 访问权限设置
function* getActivity(next) {
    const id = this.params.id

    if (!shortid.isValid(id)) {// id illegal
        this.throw('Illegal', 400)
    }

    const activity = yield* Activity.findOne({ id: id })

    if(!activity) {// don't find
        this.throw('Illegal', 400)
    }

    const pickList = ['owner', 'date', 'title', 'description', 'public', 'like', 'participator', 'pendingList']
    this.body = R.pick(pickList, activity.attributes)
}

function* delActivity(next) {
    const actID = this.params.id
    const userID = this.state.user.id
    const activity = yield* Activity.where('id', actID).findOne()

    if (!activity || activity.get('owner') !== userID) {
        this.throw('Illegal', 400)
    }

    try {
        yield* activity.remove()
        this.body = {
            success: true
        }
    } catch (e) {
        this.throw('Internal Server Error')
        console.log(e.message)
    }
}

function* like(next) {
    const actID = this.params.id
    const userID = this.state.user.id
    const activity = yield* Activity.findOne({ id: actID })
    if (!activity) {
        this.throw('Illegal', 400)
    }

    const index = activity.get('like').indexOf(actID)
    index !== -1
        ? activity.get('like').splice(index, 1)
        : activity.get('like').push(actID)

    try {
        yield* activity.save()
        this.body = {
            success: true
        }
    } catch (e) {
        this.throw('Internal Server Error')
        console.log(e.message)
    }
}

function* join(next) {
    const actID = this.params.id
    const userID = this.state.user.id
    const activity = yield* Activity.findOne({ id: actID })

    if (!activity) {
        this.throw(400, 'Illegal')
    }

    if (activity.get('owner') === userID) {
        // owner
        
        let userList = this.request.body.userList
        const type = validator.trim(this.request.body.type || '')
        if (!Array.isArray(userList)) {
            this.throw(400, 'Illegal')
        }

        // SQL Injection Prevention
        userList = userList.map(v => validator.trim(v))

        // todo pass or ban
        const oldList = activity.get('pendingList')
        activity.set('pendingList', R.difference(oldList, userList))
        activity.set('participator', R.difference(oldList, activity.get('pendingList')))

        try {
            yield* activity.save()
            this.body = {
                success: true
            }
        } catch (e) {
            this.throw('Internal Server Error')
            console.log(e.message)
        }

    } else if (activity.get('pendingList').indexOf(userID) === -1
            && activity.get('participator').indexOf(userID) === -1) {
        // join
        activity.get('pendingList').push(userID)

        try {
            yield* activity.save()
            this.body = {
                success: true
            }
        } catch (e) {
            this.throw('Internal Server Error')
            console.log(e.message)
        }
    } else {
        this.throw(400, 'Illegal')
    }
}

module.exports = {
    getActivities,
    addActivity,
    getActivity,
    delActivity,
    like,
    join
}
