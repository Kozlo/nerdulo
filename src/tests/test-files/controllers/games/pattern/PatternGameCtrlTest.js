(function() {
    'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Pattern Game", {
        setup: function () {
            // create a mock module for the test, needs to also be included by the injector below
            angular.module('GameCtrl', []).controller('GameController', function() {
                this._startGame = function() {};
            });

            var injector = angular.injector(['ng', 'PatternGameCtrl', 'GameCtrl', 'PatternService']),
                $controller = injector.get('$controller');

            // TODO see if this is needed
            this.oPtrnSrv = injector.get('Patterns');
            this.oCtrl = $controller('PatternGameController',{
                controller: $controller,
                Patterns: this.oPtrnSrv
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

    test("Test to see if the controller exists and the correct route is used", function () {
        ok(this.oCtrl, 'The Pattern Game controller exists');
        // TODO: check what instanceof should be used
        //ok(this.oCtrl instanceof, "The controller is an instance of...");
    });

    //===============================
    //  Property checks
    //===============================

    test("Does the controller have all the necessary properties", function() {
        var sGame ="pattern",
            sAllStarTarget = "pattern-allstar",
            sTagline = "Choose the number that fits in the pattern.";

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

        var stub_generateQuestions = sinon.stub(this.oPtrnSrv, "generateQuestions").returns(aTestQuestions),
            stub_startGame = sinon.stub(this.oCtrl, "_startGame");

        this.oCtrl.startGame();

        ok(stub_generateQuestions.called, "Answer service method generateQuestions called");

        ok(stub_startGame.called, "Private method _startGame called");
        ok(stub_startGame.calledWith(aTestQuestions), "Private method _startGame called with the generated questions");

        stub_generateQuestions.restore();
        stub_startGame.restore();
    });
}());