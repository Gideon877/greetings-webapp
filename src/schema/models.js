const mongoose = require('mongoose');
module.exports = function(mongoUrl){
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoUrl, {useMongoClient: true});

    const Name = mongoose.model('Name', {
        name : String,
        greetCounter : Number,
        languages: Array,
        timestamp: {
            currentLanguage: String,
            firstGreeted: String,
            lastGreeted: String
        }
    });

    return {
        Name
    };

};
