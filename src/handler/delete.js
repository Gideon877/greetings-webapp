'use strict';
const _ = require('lodash');

module.exports = function(models) {
    const mongoDB = models.Name;
    const clearHistory = (req, res, done) => {
        mongoDB.remove({}, (error, result) => {
            if (error) {
                req.flash('error', 'Failed to clear names');
                res.render('settings');
            }
            res.render('settings', {result})
        })
    }

    return {
        clearHistory
    }
};


