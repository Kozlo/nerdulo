/**
 * countingGame.js - Counting game tests.
 */

(function() {
    /**
     * Here all variables for the tests can be found
     */
    var sGame = "Counting Game",
        regex_allstarUrl = /http:\/\/localhost:8080\/allstars#counting-allstar/;

    var id_startGameWrapper = "#start-game-wrapper",
        id_gameStartButton = "button#game-start-button",
        id_gameQuestionWrapper= "#counting-game-question-wrapper",
        id_gameEndWrapper = "#game-end-wrapper",
        id_gameSubmitForm = "form#game-submit-form",
        id_gameSubmitPlayerName = "input#game-submit-player-name",
        id_gameScoreSubmitButton = "button#game-score-submit-button",
        id_allstarList = "#allstar-list";

    var id_num_gameSubmitButton = "button#game-submit-button-",
        id_num_countingGameQuestion = "#counting-game-question-",
        id_num_gamePromptQuestion = "#game-prompt-question-";

    var class_gameQuestion = ".counting-game-question",
        class_gameSubmitButton = ".game-submit-button",
        class_answerOptionButton = ".btn-answer-option";

    var class_num_answerOptionButton = ".btn-answer-option-";


    casper.test.begin('Counting Game works properly and result can be saved', 75, function suite(test) {
        casper.start("http://localhost:8080/counting-game", function() {
            this.echo("Starting Browser tests for: " + sGame);
            // check if the start game wrapper is visible
            test.assertVisible(id_startGameWrapper, "start game wrapper is visible");
            // check if the start button is visible
            test.assertVisible(id_gameStartButton, "start game button is visible");
            // check if the game questions wrapper is not visible before starting the game
            test.assertNotVisible(id_gameQuestionWrapper, "game question wrapper is not visible before starting the game");
        });

        // start the game
        casper.then(function() {
            this.click(id_gameStartButton);
        });

        // check if questions have been generated properly
        casper.then(function() {
            // check if the start game wrapper is not visible after starting the game
            test.assertNotVisible(id_startGameWrapper, "start game wrapper is not visible after starting game");

            // check if the game question wrapper is visible after starting the game
            test.assertVisible(id_gameQuestionWrapper, "game question wrapper is visible after starting game");

            // check the question count
            test.assertEval(function(class_gameQuestion) {
                return __utils__.findAll(class_gameQuestion).length === 10;
            }, "the number of game questions equals 10", class_gameQuestion);

            // wait unit the submit button has been rendered
            this.waitForSelector(class_gameSubmitButton, function() {
                // make sure the submit button exists and is visible
                test.assertVisible(class_gameSubmitButton, "game submit button is visible");
            });
        });

        // work through the questions until the score can be submitted
        casper.then(function() {
            var oQuests = this.evaluate(function(class_gameQuestion) {
                return __utils__.findAll(class_gameQuestion)
            }, class_gameQuestion);

            for (var i = 0; i < oQuests.length; i++) {
                this.waitForSelector(id_num_gameSubmitButton + i, submitQuestion.bind(this, i));
            }

            function submitQuestion(iQuestIdx) {
                var iSelectedOptionIdx = (iQuestIdx % 5);

                // check if the submit button is visible
                test.assertVisible(id_num_gameSubmitButton + iQuestIdx, "submit button for question " + iQuestIdx + " is visible");

                // the prompt should ask the player to select an answer
                checkPrompt.call(this, iQuestIdx, "Your answer is: ");

                // click on submit button, a prompt should appear, and the use should stay at current question
                clickOnSubmit.call(this, iQuestIdx);

                // the submit button for the same question should be visible
                test.assertVisible(id_num_gameSubmitButton + iQuestIdx, "submit button for question " + iQuestIdx + " is still visible after clicking on submit");

                // the prompt should ask the player to select an answer
                checkPrompt.call(this, iQuestIdx, "Please select an answer!");

                // make sure there are 5 options visible
                test.assertEval(function(aArgs) {
                    return __utils__.findAll(aArgs[0] + aArgs[1] + " " + aArgs[2]).length === 5;
                }, "5 answer options for question found", [id_num_countingGameQuestion, iQuestIdx, class_answerOptionButton]);

                // click on an answer option. select an option between 0 and 4, so all options are clicked
                this.click(id_num_countingGameQuestion + iQuestIdx + " " + class_num_answerOptionButton + iSelectedOptionIdx);

                var iSelectedOption = this.evaluate(function(iQuestIdx, iSelectedOptionIdx, id_num_countingGameQuestion, class_num_answerOptionButton) {
                    return __utils__.findAll(id_num_countingGameQuestion + iQuestIdx + " " + class_num_answerOptionButton + iSelectedOptionIdx)[0].innerHTML;
                }, iQuestIdx, iSelectedOptionIdx, id_num_countingGameQuestion, class_num_answerOptionButton);

                // the prompt should ask the player to select an answer
                checkPrompt.call(this, iQuestIdx, "Your answer is: " + iSelectedOption);

                // submit the question after an options has been selected
                clickOnSubmit.call(this, iQuestIdx);
            }

            function clickOnSubmit(iQuestIdx) {
                this.click(id_num_gameSubmitButton + iQuestIdx);
            }

            function checkPrompt(iQuestIdx, sPrompt) {
                test.assertEval(function(aArgs) {
                    return document.querySelector(aArgs[0] + aArgs[1]).innerHTML === aArgs[2];
                }, "Prompt for question " + iQuestIdx + " is: " + sPrompt, [id_num_gamePromptQuestion, iQuestIdx, sPrompt]);
            }
        });

        // submit the score and check if it's on the score board
        casper.then(function() {
            test.assertVisible(id_gameEndWrapper, "end game wrapper is visible");
            test.assertVisible(id_gameSubmitForm, "game submit form is visible");
            test.assertVisible(id_gameSubmitPlayerName, "player name input visible");
            test.assertVisible(id_gameScoreSubmitButton, "submit button visible");

            // attempt to submit the form without entering a name - nothing should happen
            this.click(id_gameScoreSubmitButton);
            test.assertVisible(id_gameEndWrapper, "end game wrapper is still visible after clicking submit");
            test.assertNotVisible(id_allstarList, "all star form not visible yet");

            // fill in the form, but don't submit
            var sTestName = "Casper test on: " + new Date().toLocaleString();

            this.fill(id_gameSubmitForm, {
                "game-submit-player-name" : sTestName
            }, false);

            // submit the form
            this.click(id_gameScoreSubmitButton);

            this.waitForSelector(id_allstarList, function() {
                test.assertVisible(id_allstarList, "all star form visible");
                test.assertUrlMatch(regex_allstarUrl, "navigation to allstars with " + sGame + " selected successful");
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
}());