'use strict';

const moment = require('moment');
const languages = require('../lib/translation');
const _ = require('lodash');

module.exports = function(models) {
    const mongoDB = models.Name;
    
    const greetSomeone = (req, res, done) => {
        let { name, language } = req.body;
        if (!name) {
            req.flash('error', 'Please enter your name!')
            res.render('home', {languages});
        }

        let newName = _.capitalize(name);
        let getParams = { name: newName, language },
            event = { req, res, done };

        mongoDB.findOne({ name: newName }, (err, user) => {
            if (err) return done(err);
            if (!user) return createUser(getParams, event);
            if (user) return updateUser(user, getParams, event);
        });
    }

    function createUser(getParams, event){
        let { name, language } = getParams;
        let { req, res, done } = event; 

        let flagArr = _.filter(languages, function(index) { return index.language == language }),
            flag = flagArr[0].flag;

        mongoDB.create({
            name,
            greetCounter: 1,
            timestamp: {
                firstGreeted: moment().format('MMMM Do YYYY, h:mm:ss a'),
                lastGreeted: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            languages: [
                {
                    type: language,
                    counter: 1,
                    last: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    flag
                }
            ]
        }, (err, user) => {
            if (err) {
                req.flash('error', 'Error occured saving to database.');
                return done(err)
            }
            let obj = _.find(languages, function(x) {
                return x.language == language
            });

            mongoDB.find({}, (err, users) => {
                if (err) return done(err);
                let namesGreeted = _.sortBy(users, [function(index) { return index.name; }]);
                res.render('home', { languages, obj, user, counter: users.length, namesGreeted });     
            });
        });       
    };

    function updateUser(user, getParams, event){
        let { name, language } = getParams;
        let { res, done } = event;
        let arr = user.languages;
        let getLanguageIndex = _.findIndex(arr, function(index) {
            return index.type == language;
        });
        let flagArr = _.filter(languages, function(index) { return index.language == language }),
            flag = flagArr[0].flag;
        
        if (getLanguageIndex >= 0) {
            mongoDB.update({ name, 'languages.type': language }, { $inc: {'languages.$.counter': 1} }, { $set: {'languages.$.last': moment().format('MMMM Do YYYY, h:mm:ss a')}},
                function(err){
                    if (err) return done(err)
            })
        } else {
            user.languages = user.languages.concat({
                type: language,
                counter: 1,
                last: moment().format('MMMM Do YYYY, h:mm:ss a'),
                flag
            });
        };
        user.greetCounter = user.greetCounter + 1;
        user.timestamp.lastGreeted = moment().format('MMMM Do YYYY, h:mm:ss a');

        user.save(function(err, result) {
            if (err) return done(err);
        }); 
        
        let obj = _.find(languages, function(x) {
            return x.language == language
        });

        mongoDB.find({}, (err, users) => {
            if (err) return done(err);
            let namesGreeted = _.sortBy(users, [function(index) { return index.name; }]);
            res.render('home', { languages, obj, user, counter: users.length, namesGreeted });     
        });
    };

    return {
        greetSomeone
    }
}