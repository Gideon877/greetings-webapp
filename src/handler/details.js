// 'use strict';
// const languages = require('../lib/translation');

// module.exports = function(models) {
//     const mongoDB = models.Name;
//     const getUser = (req, res, done) => {
//         const _id = req.params.id;
//         mongoDB.findOne({_id}, (err, user) => {
//             if (err) {
//                 req.flash('error', 'Invalid user Id provided.')
//                 res.render('details');
//             }
//             console.log(user);
            
//             res.render('details', { user });
//          });
//     }
//     return {
//         getUser
//     }
//  };