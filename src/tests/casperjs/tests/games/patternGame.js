/**
 * patternGame.js - Browser tests for The Pattern Game
 */

(function() {
    var gameTests = require('../../modules/game/tests');

    casper.test.begin('Pattern Game works properly and result can be saved', 75, function suite(test) {
        var oCustomConfig = {
            game: "Pattern Game",
            gameUrl: "http://localhost:8080/pattern-game",
            regex_alltarUrl: /http:\/\/localhost:8080\/allstars#pattern-allstar/
        };

        gameTests.runTests(test, oCustomConfig);
    });
}());