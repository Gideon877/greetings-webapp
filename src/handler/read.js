'use strict';
const languages = require('../lib/translation');

module.exports = function(models) {

    const mongoDB = models.Name;
    
    const getHomeScreen = (req, res, done) => {

        req.flash('default', 'Your greeting message will be displayed here.');
        req.flash('error', 'Please enter the name to be greeted.');
        res.render('home', {languages});
    }

    return {
        getHomeScreen
    }
}