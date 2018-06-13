var Mocha = require('mocha');

function runMocha(callback) {
    var mocha = new Mocha();

    mocha.addFile('test/models.test.js');

    mocha.run(function () {
        callback();
    });
}

runMocha(function () {
    runMocha(function () {});
});