module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    require('./routes/allstars.js')(app);

    var functions = require('./functions.js');

    // testing routes =========================================================
    // route for unit testing
    app.get('/unit_test',functions.isNotProd, function(req, res) {
        res.sendfile('./public/tests/main.qunit.testsuite.html');
    });

    // frontend routes =========================================================
    // route to handle all angular requests (this needs to be the very last one)
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load our public/index.html file
    });
};