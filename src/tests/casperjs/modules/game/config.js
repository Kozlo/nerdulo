/**
 * config.js - Re-usable browser test config for different games
 */

module.exports = {
    ids: {
        id_startGameWrapper: "#start-game-wrapper",
        id_gameStartButton: "button#game-start-button",
        id_gameQuestionWrapper: "#game-question-wrapper",
        id_gameEndWrapper: "#game-end-wrapper",
        id_gameSubmitForm: "form#game-submit-form",
        id_gameSubmitPlayerName: "input#game-submit-player-name",
        id_gameScoreSubmitButton: "button#game-score-submit-button",
        id_allstarList: "#allstar-list"
    },
    numberedIds: {
        id_num_gameSubmitButton: "button#game-submit-button-",
        id_num_GameQuestion: "#game-question-",
        id_num_gamePromptQuestion: "#game-prompt-question-"
    },
    classes: {
        class_gameQuestion: ".game-question",
        class_gameSubmitButton: ".game-submit-button",
        class_answerOptionButton: ".btn-answer-option"
    },
    numberedClasses: {
        class_num_answerOptionButton: ".btn-answer-option-"
    }
};