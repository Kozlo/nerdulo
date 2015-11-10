(function() {
    'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Counting Game", {
        setup: function () {
            var injector = angular.injector(['ng', 'CountingGameCtrl', 'AnswerService', 'AllStarService']);

            this.ansSrv = injector.get('Answers');
            this.allstars = injector.get('AllStars');
            // TODO: figure out how to include the actually $location service
            this.mockLocation = { location: { href: ""} };

            var $controller = injector.get('$controller');

            this.oCtrl = $controller('CountingGameController',{
                $location: this.mockLocation,
                Answers: this.ansSrv,
                AllStars: this.allstars
            });

            // make sure the game is started as it's needed for proper tests
            this.oCtrl.startGame();
        },
        teardown: function () {

        }
    });

    //===============================
    //  General Tests
    //===============================

    test("Test to see if the controller exists and the correct route is used", function() {
        ok(this.oCtrl, 'The controller exists');
        // TODO: check what instanceof should be used
        //ok(this.oCtrl instanceof, "The controller is an instance of...");
    });

    //===============================
    //  Start Game Tests
    //===============================

    test("Does startGame instantiates questions and creates the correct properties", function() {
        var spy_generateQuestions = sinon.spy(this.ansSrv, "generateQuestions");

        this.oCtrl.startGame();

        var aQuests = this.oCtrl.aQuests;

        ok(spy_generateQuestions.called, "Answer service method generateQuestions called");
        ok(aQuests, "Questsions property exists");
        ok(aQuests.length, "Questions property type is array");
        // TODO: add this back when the config has been added to the all answers object properly
        //equal(aQuests.length, aQuests.oConfig.questCount, "Questions property type is array");

        strictEqual(aQuests[0].bIsCurr, true, "The first question is set as the current question");

        // check the rest of the question to see if they are not set as the current question as well
        for (var i = 1; i < aQuests.length; i++) {
            ok(!aQuests[i].bIsCurr, "When starting the game, question no '" + i + "' is not set as the current question.")
        }

        ok(this.oCtrl.bIsPlaying, "Is playing property exists");
        strictEqual(this.oCtrl.bIsPlaying, true, "Is playing property is set to true");

        ok(this.oCtrl.nStartTime, "Start time property exists");
        equal(typeof this.oCtrl.nStartTime, "number", "Start time property type is number");

        notEqual(typeof this.oCtrl.nQuestNo, "undefined",  "Current question property exists");
        equal(typeof this.oCtrl.nQuestNo, "number", "Current question property type if number");
        strictEqual(this.oCtrl.nQuestNo, 0, "Current question property is 0 (number)");
    });

    //===============================
    //  Submit Answer Tests
    //===============================

    var aAnswerStates = [true, false];

    for (var i = 0; i < aAnswerStates.length; i++) {
        runSubmitAnswerTest(aAnswerStates[i]);
    }

    function runSubmitAnswerTest(bAnsState) {
        test("Does submitAnswer check the answer and submit it when it's validity is: " + aAnswerStates[i], function () {
            var bIsQuestValid = bAnsState;

            var stub_validateAnswer = sinon.stub(this.oCtrl, "_validateAnswer").returns(bIsQuestValid),
                stub_processAnswer = sinon.stub(this.oCtrl, "_processAnswer");

            this.oCtrl.submitAnswer();

            ok(stub_validateAnswer.called, "validateAnswer called");
            ok(stub_validateAnswer.calledWith(this.oCtrl.aQuests[this.oCtrl.nQuestNo]), "validateAnswer called with the current question");

            equal(stub_processAnswer.called, bIsQuestValid, "processAnswer method called: " + bIsQuestValid);

            stub_validateAnswer.restore();
            stub_processAnswer.restore();
        });
    }

    test("Does _validateAnswer return a correct indicator depending on the player answer", function() {
        var sDefaultPlayerPrompt = "Your answer is: ",
            oCurrQuest1 = {
                nPlayerAnswer : 13,
                sPlayerPrompt : sDefaultPlayerPrompt
            },
            oCurrQuest2 = {
                sPlayerPrompt : sDefaultPlayerPrompt
            };

        var bIsAnswerValid1 = this.oCtrl._validateAnswer(oCurrQuest1),
            bIsAnswerValid2 = this.oCtrl._validateAnswer(oCurrQuest2);

        ok(bIsAnswerValid1, "The indicator is true when an answer is selected");
        equal(oCurrQuest1.sPlayerPrompt, sDefaultPlayerPrompt, "Player prompt property is set as the default one")

        ok(!bIsAnswerValid2, "The indicator is false when no answer is selected");
        ok(oCurrQuest2.sPlayerPrompt !== "undefined", "Player prompt property exists when no answer is selected");
        equal(oCurrQuest2.sPlayerPrompt, "Please select an answer!", "Player prompt property is set correctly when no answer is selected");
    });

    test("Does _processAnswer switched to next question if the current on is not the last one", function() {
        var oTestCurrQuest = {
            bIsLast : false
        };

        var stub_switchToNextQuest = sinon.stub(this.oCtrl, "_switchToNextQuest"),
            stub_endGame = sinon.stub(this.oCtrl, "endGame");

        this.oCtrl._processAnswer(oTestCurrQuest);

        ok(stub_switchToNextQuest.called, "_switchToNextQuest called");
        ok(stub_switchToNextQuest.calledWith(oTestCurrQuest), "_switchToNextQuest called with the passed current question");

        ok(stub_endGame.notCalled, "endGame not called");
    });

    test("Does _processAnswer switched to next question if the current on is the last one", function() {
        var oTestCurrQuest = {
            bIsLast : true
        };

        var stub_switchToNextQuest = sinon.stub(this.oCtrl, "_switchToNextQuest"),
            stub_endGame = sinon.stub(this.oCtrl, "endGame");

        this.oCtrl._processAnswer(oTestCurrQuest);

        ok(stub_switchToNextQuest.notCalled, "_switchToNextQuest not called");

        ok(stub_endGame.called, "endGame called");
    });

    test("Does _switchToNextQuest change the properties for the controller properly", function() {
        var nCurrQuestNo = this.oCtrl.nQuestNo,

            oTestCurrQuest = {
                bIsCurr : true
            };

        this.oCtrl._switchToNextQuest(oTestCurrQuest);

        ok(!oTestCurrQuest.bIsCurr, "The bIsCurr indicator for the passed question is set to false");
        equal(this.oCtrl.nQuestNo, nCurrQuestNo + 1, "The current question indicator has been increased by 1.");
        ok(this.oCtrl.aQuests[nCurrQuestNo + 1].bIsCurr, "The bIsCurr indicator for the passed question is set to false");
    });

    //===============================
    //  End Game Tests
    //===============================

    test("Does endGame call the needed methods to finish a game", function() {
        var nTestGameResult = 13,
            nTestTotalSeconds = 23,
            sTestGameTime = "number 41";

        var stub_getGameResult = sinon.stub(this.oCtrl, "_getGameResult").returns(nTestGameResult),
            stub_getTotalSeconds = sinon.stub(this.oCtrl, "_getTotalSeconds").returns(nTestTotalSeconds),
            stub_getGameTime = sinon.stub(this.oCtrl, "_getGameTime").returns(sTestGameTime);

        this.oCtrl.endGame();

        notEqual(this.oCtrl.bGameFinished, "undefined", "game finished indicator exists.");
        equal(this.oCtrl.bGameFinished, true, "game finished indicator is set to true.");

        ok(stub_getTotalSeconds.called, "_getTotalSeconds called");
        notEqual(this.oCtrl.nGameScore, "undefined", "nGameScore property exists.");
        equal(this.oCtrl.nGameScore, nTestGameResult, "nGameScore property set as the return value of _getGameResult.");

        ok(stub_getTotalSeconds.called, "_getTotalSeconds called");
        notEqual(this.oCtrl.nTotalSeconds, "undefined", "nTotalSeconds property exists.");
        equal(this.oCtrl.nTotalSeconds, nTestTotalSeconds, "nTotalSeconds property set as the return value of _getTotalSeconds.");

        ok(stub_getGameTime.called, "getTotalSeconds called");
        notEqual(this.oCtrl.sGameTime, "undefined", "sGameTime property exists.");
        equal(this.oCtrl.sGameTime, sTestGameTime, "sGameTime property set as the return value of _getGameTime.");

        stub_getGameResult.restore();
        stub_getTotalSeconds.restore();
        stub_getGameTime.restore();
    });

    test("Does _getGameResult return the correct number of answers properly", function() {
        var nWrongAnswers = 2,
            nReturnedWrongAnswers = 0;

        var stub_answerChecker = sinon.stub(this.oCtrl, "_answerChecker", function(nIndex) {
            if (nReturnedWrongAnswers < nWrongAnswers) {
                nReturnedWrongAnswers++;
                return false;
            } else {
                return true;
            }
        });

        var nTestResults = this.oCtrl._getGameResult();

        ok(stub_answerChecker.called, "_answerChecker called");

        for (var i = 0; i < this.oCtrl.aQuests.length; i++) {
            ok(stub_answerChecker.calledWith(this.oCtrl.aQuests[i].nPlayerAnswer, this.oCtrl.aQuests[i].nAnswer), "_answerChecker called with player answer and correct answer for question: " + i);
        }

        equal(stub_answerChecker.callCount, this.oCtrl.aQuests.length, "_answerChecker called count equals question count");

        equal(nTestResults, this.oCtrl.aQuests.length - nWrongAnswers, "The result equals the passed correct answers");

        stub_answerChecker.restore();
    });

    test("Does _answerChecker return true when a correct answer is provided", function() {
        var nTestPlayerAns = 3,
            nTestCorrectAns = 3;

        var bTestAns = this.oCtrl._answerChecker(nTestPlayerAns, nTestCorrectAns);

        // TODO: must be true...
        equal(bTestAns, true, "_answerChecked returns false when player answer and the passed answer are equal");
    });

    test("Does _answerChecker return true when an incorrect answer is provided", function() {
        var nTestPlayerAns = 3,
            nTestCorrectAns = 4;

        var bTestAns = this.oCtrl._answerChecker(nTestPlayerAns, nTestCorrectAns);

        // TODO: must be true...
        equal(bTestAns, false, "_answerChecked returns false when player answer and the passed answer are equal");
    });

    test("Does _getTotalSeconds return the expected result", function() {
        var iStartTime = 5,
            iTotalTime = 10;


        var stub_calculateTotalSeconds = sinon.stub(this.oCtrl, "_calculateTotalSeconds").returns(iTotalTime);

        var iResult = this.oCtrl._getTotalSeconds(iStartTime);

        ok(stub_calculateTotalSeconds.called, "spy_calculateTotalSeconds called");
        ok(stub_calculateTotalSeconds.calledWith(iStartTime, sinon.match.any), "spy_calculateTotalSeconds called");

        equal(iResult, iTotalTime, "_getTotalSeconds return the return value of _calculateTotalSeconds");
    });


    //===============================
    //  Submit Results Tests
    //===============================

    // TODO: write unit  tests

}());