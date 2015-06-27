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
        var oTestConfig = {
            questCount: 10,
            falseOptCount : 5,
            minDev : -20,
            maxDev : 20,
            minNum : 11,
            maxNum : 29
        };

        var spy_generateQuestions = sinon.spy(this.ansSrv, "generateQuestions");

        this.oCtrl.startGame();

        var aQuests = this.oCtrl.aQuests;

        ok(spy_generateQuestions.called, "Answer service method generateQuestions called");
        ok(spy_generateQuestions.calledWith(oTestConfig), "generate questions called with the correct config object");
        ok(aQuests, "Questsions property exists");
        ok(aQuests.length, "Questions property type is array");
        equal(aQuests.length, oTestConfig.questCount, "Questions property type is array");

        strictEqual(aQuests[0].isCurr, true, "The first question is set as the current question");

        // check the rest of the question to see if they are not set as the current question as well
        for (var i = 1; i < aQuests.length; i++) {
            ok(!aQuests[i].isCurr, "When starting the game, question no '" + i + "' is not set as the current question.")
        }

        strictEqual(this.oCtrl.aQuests[0].isCurr, true, "Is playing property is set to true");

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

    // TODO: write unit  tests

    //===============================
    //  End Game Tests
    //===============================

    // TODO: write unit  tests

    //===============================
    //  Submit Results Tests
    //===============================

    // TODO: write unit  tests

}());