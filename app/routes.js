module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    require('./routes/allstars.js')(app);

    var functions = require('./functions.js');

    // testing routes =========================================================
    // route for unit testing
    app.get('/unit_test',functions.isNotProd, function(req, res) {
        // For demo purposes now I'm enabling tests on production
        //if (process.env.NODE_ENV !== "production") {
        //    console.log("Not on production, sending test files...");
            res.sendFile('dist/tests/main.qunit.testsuite.html', { root: "./" });
        //}
    });

    // frontend routes =========================================================
    // route to handle all angular requests (this needs to be the very last one)
    app.get('*', function(req, res) {
        res.sendFile('dist/index.html', { root: "./" }); // load our dist/index.html file
    });
};