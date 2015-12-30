/**
 * allstars.js - All Stars page tests.
 */

(function() {
    casper.test.begin('Nerdulo All Stars pag shows correct results', 10, function suite(test) {
        casper.start("http://localhost:8080/allstars", function () {
            test.assertVisible("#allstar-page-wrapper", "all star page wrapper exists and is visible");
            test.assertVisible("#allstar-list", "all list section is visible");
            test.assertVisible("#pattern-game-allstar-results", "pattern game all stars are shown by default");
            test.assertNotVisible("#counting-game-allstar-results", "counting game all stars are NOT shown by default");
        });

        // click on the counting game button to see if the all stars list changed
        casper.then(function () {
            this.click("button#show-counting-allstars-button");
            test.assertUrlMatch(/http:\/\/localhost:8080\/allstars#counting-allstar/, "counting game hash value is shown");
            test.assertVisible("#counting-game-allstar-results", "counting game all stars are shown when counting button is clicked");
            test.assertNotVisible("#pattern-game-allstar-results", "pattern game all stars are NOT shown when counting button is clicked");
        });

        // click on the pattern game button to see if the all stars list changed
        casper.then(function () {
            this.click("button#show-pattern-allstars-button");
            test.assertUrlMatch(/http:\/\/localhost:8080\/allstars#pattern-allstar/, "pattern game hash value is shown");
            test.assertNotVisible("#counting-game-allstar-results", "counting game all stars are NOT shown when counting button is clicked");
            test.assertVisible("#pattern-game-allstar-results", "pattern game all stars are shown when counting button is clicked");
        });

        casper.run(function () {
            test.done();
        });
    });
}());