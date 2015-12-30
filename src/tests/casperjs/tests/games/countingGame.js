/**
 * countingGame.js - Browser tests for counting game
 */

(function() {
    var game = require('../../modules/game');

    casper.test.begin('Counting Game works properly and result can be saved', 75, function suite(test) {

        var oConfig = {
            custom: {
                sGame: "Counting Game",
                regex_alltarUrl: /http:\/\/localhost:8080\/allstars#counting-allstar/
            },
            ids: {
                id_startGameWrapper: "#start-game-wrapper",
                id_gameStartButton: "button#game-start-button",
                id_gameQuestionWrapper: "#counting-game-question-wrapper",
                id_gameEndWrapper: "#game-end-wrapper",
                id_gameSubmitForm: "form#game-submit-form",
                id_gameSubmitPlayerName: "input#game-submit-player-name",
                id_gameScoreSubmitButton: "button#game-score-submit-button",
                id_allstarList: "#allstar-list"
            },
            numberedIds: {
                id_num_gameSubmitButton: "button#game-submit-button-",
                id_num_countingGameQuestion: "#counting-game-question-",
                id_num_gamePromptQuestion: "#game-prompt-question-"
            },
            classes: {
                class_gameQuestion: ".counting-game-question",
                class_gameSubmitButton: ".game-submit-button",
                class_answerOptionButton: ".btn-answer-option"
            },
            numberedClasses: {
                class_num_answerOptionButton: ".btn-answer-option-"
            }
        };

        game.runTests(test, oConfig);
    });
}());