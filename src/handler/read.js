'use strict';
const moment = require('moment');
const languages = require('../lib/translation');
const _ = require('lodash');

module.exports = function(models) {
    const mongoDB = models.Name;
    
    const getHomeScreen = (req, res, done) => {
        mongoDB.find({}, (err, users) => {
            if (err) return done(err);
            let saLang = _.filter(languages, function(index) { return !index.crossborder; });
            let intLang = _.filter(languages, function(index) { return index.crossborder; });
            res.render('home', { saLang, intLang , counter: users.length, namesGreeted: users });
        })
    }
    
    const getUser = (req, res, done) => {
        const _id = req.params.id;
        mongoDB.findOne({_id}, (err, user) => {
            if (err) {
                req.flash('error', 'Invalid user Id provided.')
                res.render('details');
            }
            res.render('details', {user});
         })
    }

    const getAdminPage = (req, res, done) => {
        const { username, password } = req.body;
        mongoDB.findOne({ username }, (err, user) => {
            if (err) {
                req.flash('error', 'Invalid user Id provided.')
                res.render('details');
            }
            res.render('admin', {user});
         })
    }

    const getNames = (req, res, done) => {
        mongoDB.find({}, (err, users) => {
            if (err) {
                req.flash('error', err)
                res.render('names');
            }       
            let ascOrder = _.sortBy(users, ['name']);     
            res.render('names', { users: ascOrder});
        })

    }

    return {
        getHomeScreen,
        getUser,
        getAdminPage,
        getNames
    }
}