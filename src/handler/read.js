'use strict';
const languages = require('../lib/translation');

module.exports = function(models) {

    const mongoDB = models.Name;
    
    const getHomeScreen = (req, res, done) => {

        req.flash('default', 'Your greeting message will be displayed here.');
        let obj = {
            name
        }
        res.render('home', {languages, obj});
    }




    return {
        getHomeScreen
    }
}