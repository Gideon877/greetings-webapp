const assert = require('assert');
const Models = require('../src/schema/models');
const _ = require('lodash');
const moment = require('moment');
describe('modules should be able to', function() {

    var models = Models('mongodb://localhost/greet-tests');

    beforeEach(function(done) {
        models.Name.remove({}, function(err){
            if(err){
                done(err)
            }
            models.Name.create({
                name : "Viwe",
                greetCounter : 1,
                timestamp: {
                    firstGreeted: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    lastGreeted: moment().format('MMMM Do YYYY, h:mm:ss a')
                },
                languages: [
                    {
                        counter: 1,
                        first: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        last: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        type: 'Afrikaans',
                        flag: 'za'
                    }
                ]
            }, function(err){
                done(err);
            });
        });
    });

    it('store Names to MongoDB', function(done) {
        var nameData = {
            name: 'Thabang',
            greetCounter : 2,
            timestamp: {
                firstGreeted: moment().format('MMMM Do YYYY, h:mm:ss a'),
                lastGreeted: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            languages: [
                {
                    counter: 1,
                    first: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    last: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    type: 'Zulu',
                    flag: 'za'
                }
            ]
        };
        models.Name
            .create(nameData, function(err) {
                models.Name.findOne({
                    name: 'Thabang',
                }, function(err, person) {
                    // console.log(person);
                    assert.equal("Thabang", person.name)
                    assert.equal(2, person.greetCounter)
                    done(err);
                });
            });
    });

    it('create a new Name', function(done) {


        models.Name.findOne({
            name : "Andre"
        }, function(err, theName){

            if (err){
                //test fail if there is an error
                return done(err)
            }

            // theName is not in the Datase
            assert.ok(theName === null);

            if (!theName){
                models.Name.create({
                    name : 'Andre',
                    greetCounter : 1
                }, function(err, result){
                    if (err){
                        return done(err);
                    }
                    // check if the user was created
                    models.Name.find({name : "Andre"}, function(err, results){
                        if (err){
                            return done(err);
                        }

                        assert.equal(1, results.length);
                        assert.equal(1, results[0].greetCounter);
                        assert.equal("Andre", results[0].name);
                        done();

                    });

                });
            }

        })

    });

    it('update the counter for a Name that exists', function(done) {


        models.Name.findOne({
            name : "Viwe"
        }, function(err, theName){

            if (err){
                //test fail if there is an error
                return done(err)
            }

            // theName is not in the Datase
            assert.ok(theName !== null);

            if (theName){

                theName.greetCounter = theName.greetCounter + 1;

                theName
                    .save(function(err, result){
                        //console.log(result);

                        assert.equal("Viwe", result.name)
                        assert.equal(2, result.greetCounter)

                        done(err);
                    });
            }
                // models.Name.create({
                //     name : 'Andre',
                //     greetCounter : 1
                // }, function(err, result){
                //     if (err){
                //         return done(err);
                //     }
                //     // check if the user was created
                //     models.Name.find({name : "Andre"}, function(err, results){
                //         if (err){
                //             return done(err);
                //         }
                //
                //         assert.equal(1, results.length);
                //         assert.equal(1, results[0].greetCounter);
                //         assert.equal("Andre", results[0].name);
                //         done();
                //
                //     });

                //});

            //}

        });

    });

});
