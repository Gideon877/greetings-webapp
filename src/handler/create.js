'use strict';

const languages = require('../lib/translation');
const _ = require('lodash');

module.exports = function(models) {
    const mongoDB = models.Name;
    
    const greetSomeone = (req, res, done) => {
        let { name, language} = req.body;
        if (!name) {
            req.flash('error', 'Please enter your name!')
            res.render('home', {languages});
        }

        let getParams = { name, language },
            event = { req, res, done };

        mongoDB.findOne({ name }, (err, user) => {
            if (err) return done(err);
            if (!user) return createUser(getParams, event);
            if (user) return updateUser(user, getParams, event);
        });
    }

    function createUser(getParams, event){
        let { name, language} = getParams;
        let { req, res, done } = event;

        mongoDB.create({
            name,
            greetCounter: 1,
            timestamp: {
                firstGreeted: new Date(),
                lastGreeted: new Date()
            },
            languages: [
                {
                    type: language,
                    counter: 1
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
            res.render('home', { languages, obj, user });
        });       
    };

    function updateUser(user, getParams, event){
        let { req, res, done } = event;
        let { language, name } = getParams;
        let arr = user.languages;
        let getLanguageIndex = _.findIndex(arr, function(index) {
            return index.type == language;
        });
        
        if (getLanguageIndex >= 0) {
            mongoDB
            .update({
                name,
                'languages.type': language
                }, 
                {
                    $inc: {'languages.$.counter': 1}
                },
                function(err){
                    if (err) return done(err)
            })
        }
        else {
            let newLanguage = {
                type: language,
                counter: 1
            }
            // user.languages.push(newLanguage);
        };

        user.greetCounter = user.greetCounter + 1;
        user.timestamp.lastGreeted = new Date();

        user.save(function(err, result) {
            if (err) return done(err);
        }); 
        
        let obj = _.find(languages, function(x) {
            return x.language == language
        });

        res.render('home', { languages, obj, user});     

    };

    return {
        greetSomeone
    }
}