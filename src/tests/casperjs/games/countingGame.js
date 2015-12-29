/**
 * countingGame.js - Counting game tests.
 */

casper.test.begin('Counting Game works properly and result can be saved', 45, function suite(test) {
    casper.start("http://localhost:8080/counting-game", function() {
        // check if the start game wrapper is visible
        test.assertVisible("#start-game-wrapper", "start game wrapper is visible");
        // check if the start button is visible
        test.assertVisible("button#game-start-button", "start game button is visible");
        // check if the counting game questions wrapper is not visible before starting the game
        test.assertNotVisible("#counting-game-question-wrapper", "counting game question wrapper is not visible before starting the game");
    });

    // start the game
    casper.then(function() {
        this.click("button#game-start-button");
    });

    // check if questions have been generated properly
    casper.then(function() {
        // check if the start game wrapper is not visible after starting the game
        test.assertNotVisible("#start-game-wrapper", "start game wrapper is not visible after starting game");

        // check if the counting game question wrapper is visible after starting the game
        test.assertVisible("#counting-game-question-wrapper", "counting game question wrapper is visible after starting game");

        // check the question count
        test.assertEval(function() {
            return __utils__.findAll(".counting-game-question").length === 10;
        }, "the number of counting game questions equals 10");

        // wait unit the submit button has been rendered
        this.waitForSelector("#game-submit-button", function() {
            // make sure the submit button exists and is visible
            test.assertVisible("button#game-submit-button-0", "game submit button for first question is visible");
        });
    });

    // TODO: check if submit doesn't work unless an answer has been selected

    // work through the questions until the score can be submitted
    casper.then(function() {
        var oQuests = this.evaluate(function() {
            return __utils__.findAll(".counting-game-question")
        });

        for (var i = 0; i < oQuests.length; i++) {
            this.waitForSelector("button#game-submit-button-" + i, fnSubmitQuestion.bind(this, i));
        }

        function fnSubmitQuestion(iQuestIdx) {
            // check if the submit button is visible
            test.assertVisible("button#game-submit-button-" + iQuestIdx, "submit button for question " + iQuestIdx + " is visible");

            // click on submit button, a prompt should appear, and the use should stay at current question
            this.click("button#game-submit-button-" + iQuestIdx);

            // the submit button for the same question should be visible
            test.assertVisible("button#game-submit-button-" + iQuestIdx, "submit button for question " + iQuestIdx + " is still visible after clicking on submit");

            // the prompt should ask the player to select an answer
            test.assertEval(function(iQuestIdx) {
                return __utils__.findAll("#game-prompt-question-" + iQuestIdx).value === "Please select an answer!";
            }, "5 answer options for question found", iQuestIdx); // need to pass the question index variable

            // make sure there are 5 options visible
            test.assertEval(function(iQuestIdx) {
                return __utils__.findAll("#counting-game-question-" + iQuestIdx + " .btn-answer-option").length === 5;
            }, "5 answer options for question found", iQuestIdx); // need to pass the question index variable

            // click on an answer option. select an option between 0 and 4, so all options are clicked
            this.click("#counting-game-question-" + iQuestIdx + " .btn-answer-option-" + (iQuestIdx % 5));
            this.click("button#game-submit-button-" + iQuestIdx);
        }

    });

    // submit the score and check if it's on the score board
    casper.then(function() {
        test.assertVisible("#game-end-wrapper", "end game wrapper is visible");
        test.assertVisible("form#game-submit-form", "game submit form is visible");
        test.assertVisible("input#game-submit-player-name", "player name input visible");
        test.assertVisible("button#game-submit-button", "submit button visible");

        // attempt to submit the form without entering a name - nothing should happen
        this.click("button#game-submit-button");
        test.assertVisible("#game-end-wrapper", "end game wrapper is still visible after clicking submit");
        test.assertNotVisible("#allstar-list", "all star form not visible yet");

        // fill in the form, but don't submit
        var sTestName = "Casper test on: " + new Date().toLocaleString();

        this.fill("form#game-submit-form", {
            "game-submit-player-name" : sTestName
        }, false);

        // submit the form
        this.click("button#game-submit-button");

        this.waitForSelector("#allstar-list", function() {
            test.assertVisible("#allstar-list", "all star form visible");
            test.assertUrlMatch(/http:\/\/localhost:8080\/allstars#counting-allstar/, "navigation to allstars with counting game selected successful");
            // make sure the test score appears on the allstars page
            this.waitForText(sTestName, function() {
                this.echo("Test name " + sTestName + " is available on the test page");
            });
        });
    });

    casper.run(function() {
        test.done();
    });
});