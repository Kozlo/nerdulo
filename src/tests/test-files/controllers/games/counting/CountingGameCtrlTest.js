(function() {
    'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Counting Game", {
        setup: function () {
            // create a mock module for the test, needs to also be included by the injector below
            angular.module('GameCtrl', []).controller('GameController', function() {
                this._startGame = function() {};
            });

            var injector = angular.injector(['ng', 'CountingGameCtrl', 'GameCtrl', 'AnswerService']),
                $controller = injector.get('$controller');

            this.ansSrv = injector.get('Answers');
            this.oCtrl = $controller('CountingGameController',{
                controller: $controller,
                Answers: this.ansSrv
            });

            // re-start the game for each test
            this.oCtrl.startGame();
        },
        teardown: function () {

        }
    });

    //===============================
    //  General Tests
    //===============================

    test("Test to see if the controller exists and the correct route is used", function() {
        ok(this.oCtrl, 'The Counting Game controller exists');
        // TODO: check what instanceof should be used
        //ok(this.oCtrl instanceof, "The controller is an instance of...");
    });

    //===============================
    //  Property checks
    //===============================

    test("Does the controller have all the necessary properties", function() {
        var sGame ="count",
            sAllStarTarget = "counting-allstar",
            sTagline = "Select the correct answer to the given math problems.";

        notEqual(typeof this.oCtrl.oAllStarData, "undefined", "oAllStartData property exists on the controller");
        equal(this.oCtrl.oAllStarData.game, sGame, "game property on oAllStartData is " + sGame);

        equal(this.oCtrl.sAllStarTarget, sAllStarTarget, "sAllStarTarget property is set to : " + sAllStarTarget);

        equal(this.oCtrl.sTagline, sTagline, "sTagline property is set to: " + sTagline);
    });

    //===============================
    //  Start Game Tests
    //===============================

    test("Does startGame instantiates questions and creates the correct properties", function() {
        var aTestQuestions = ["testQuestion"];

        var stub_generateQuestions = sinon.stub(this.ansSrv, "generateQuestions").returns(aTestQuestions),
            stub_startGame = sinon.stub(this.oCtrl, "_startGame");

        this.oCtrl.startGame();

        ok(stub_generateQuestions.called, "Answer service method generateQuestions called");

        ok(stub_startGame.called, "Private method _startGame called");
        ok(stub_startGame.calledWith(aTestQuestions), "Private method _startGame called with the generated questions");

        stub_generateQuestions.restore();
        stub_startGame.restore();
    });
}());