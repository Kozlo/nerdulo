module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    require('./routes/allstars.js')(app);

    var functions = require('./functions.js');

    // testing routes =========================================================
    // route for unit testing
    app.get('/unit_test',functions.isNotProd, function(req, res) {
        res.sendfile('./src/tests/main.qunit.testsuite.html');
    });

    // frontend routes =========================================================
    // route to handle all angular requests (this needs to be the very last one)
    app.get('*', function(req, res) {
        // TODO: differentiate between dev and non-dev environment
        res.sendfile('./dist/index.html'); // load our dist/index.html file
    });
};