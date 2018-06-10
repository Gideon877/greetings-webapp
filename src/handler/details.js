'use strict';
const languages = require('../lib/translation');

module.exports = function(models) {
    const mongoDB = models.Names;

    const getUser = (req, res, done) => {
        const _id = req.params.id;
        console.log('_id:', _id);
        mongoDB.find({}, (err, user) => {
            if (err) {
                console.log('user', user);
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