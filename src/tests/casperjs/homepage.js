/**
 * homepage.js - Homepage tests.
 */

casper.test.begin('Nerdulo homepage navigation works properly', 16, function suite(test) {
    casper.start("http://localhost:8080/", function() {
        test.assertTitle("Nerdulo", "Nerdulo homepage title is the one expected");
        test.assertExists("section#game-list", "game list section is found");
    });

    // counting game link
    casper.then(function() {
        test.assertExists("a#counting-game-link", "counting game link is found");
        // naviagte to the counting game
        this.click("a#counting-game-link");
        test.assertUrlMatch(/http:\/\/localhost:8080\/counting-game/, "navigation to counting game successful");
        // navigate back to the home page
        this.back();
    });

    // counting game link
    casper.then(function() {
        test.assertExists("a#pattern-game-link", "pattern game link is found");
        // naviagte to the pattern game
        this.click("a#pattern-game-link");
        test.assertUrlMatch(/http:\/\/localhost:8080\/pattern-game/, "navigation to pattern game successful");
        // navigate back to the home page
        this.back();
    });

    // navigation links
    casper.then(function() {
        // test counting game navigation link
        test.assertExists("a#counting-game-nav-link", "counting game navigation bar link is found");
        // navigate to the counting game
        this.click("a#counting-game-nav-link");
        test.assertUrlMatch(/http:\/\/localhost:8080\/counting-game/, "navigation to counting game successful");

        // test pattern game navigation link
        test.assertExists("a#pattern-game-nav-link", "pattern game navigation bar link is found");
        // navigate to the pattern game
        this.click("a#pattern-game-nav-link");
        test.assertUrlMatch(/http:\/\/localhost:8080\/pattern-game/, "navigation to pattern game successful");

        // test allstars navigation link
        test.assertExists("a#counting-allstar-nav-link", "allstar navigation bar link is found");
        // navigate to the allstars with counting game selected
        this.click("a#counting-allstar-nav-link");
        test.assertUrlMatch(/http:\/\/localhost:8080\/allstars#counting-allstar/, "navigation to allstars with counting game selected successful");

        // test team navigation link
        test.assertExists("a#team-nav-link", "team navigation bar link is found");
        // navigate to the team game
        this.click("a#team-nav-link");
        test.assertUrlMatch(/http:\/\/localhost:8080\/team/, "navigation to team page successful");

        // navigate back to the home page via the homepage link
        test.assertExists("a#homepage-nav-link", "team navigation bar link is found");
        // navigate to the homepage
        this.click("a#homepage-nav-link");
        test.assertUrlMatch(/http:\/\/localhost:8080/, "navigation back to homepage successful");
    });

    casper.run(function() {
        test.done();
    });
});