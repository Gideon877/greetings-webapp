'use strict';
const languages = require('../lib/translation');

module.exports = function(models) {

    const mongoDB = models.Name;
    
    const getHomeScreen = (req, res, done) => {

        // req.flash('success', 'Please enter your name below.');

        res.render('home', {languages});
    }




    return {
        getHomeScreen
    }
}