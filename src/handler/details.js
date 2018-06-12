'use strict';
const languages = require('../lib/translation');

module.exports = function(models) {
    const mongoDB = models.Names;

    const getUser = (req, res, done) => {
        const _id = req.params.id;
        mongoDB.find({}, (err, user) => {
            if (err) {
                req.flash('error', 'Invalid user Id provided.')
                res.render('details');
            }
         })
        res.render('details');
    }
    return {
        getUser
    }
 };