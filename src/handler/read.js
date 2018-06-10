'use strict';
const moment = require('moment');
const languages = require('../lib/translation');

module.exports = function(models) {

    const mongoDB = models.Name;
    
    const getHomeScreen = (req, res, done) => {
        mongoDB.find({}, (err, users) => {
            if (err) return done(err);
            req.flash('default', 'Your greeting message will be displayed here.');
            req.flash('error', 'Please enter your name below.');
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

    return {
        getHomeScreen,
        getUser
    }
}