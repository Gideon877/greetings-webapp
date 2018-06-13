'use strict';
const moment = require('moment');
const languages = require('../lib/translation');

module.exports = function(models) {
    const mongoDB = models.Name;
    
    const getHomeScreen = (req, res, done) => {
        mongoDB.find({}, (err, users) => {
            if (err) return done(err);
            res.render('home', {languages, counter: users.length, namesGreeted: users });
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
            console.log(user);
            
            res.render('admin', {user});
         })
    }

    const getNames = (req, res, done) => {
        mongoDB.find({}, (err, users) => {
            if (err) {
                req.flash('error', 'Invalid user Id provided.')
                res.render('names');
            }            
            res.render('names', { users});
        })

    }

    return {
        getHomeScreen,
        getUser,
        getAdminPage,
        getNames
    }
}