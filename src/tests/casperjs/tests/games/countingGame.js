/**
 * countingGame.js - Browser tests for The Counting Game
 */

(function() {
    var gameTests = require('../../modules/game/tests');

    casper.test.begin('Counting Game works properly and result can be saved', 75, function suite(test) {
        var oCustomConfig = {
            game: "Counting Game",
            gameUrl: "http://localhost:8080/counting-game",
            regex_alltarUrl: /http:\/\/localhost:8080\/allstars#counting-allstar/
        };

        gameTests.runTests(test, oCustomConfig);
    });
}());