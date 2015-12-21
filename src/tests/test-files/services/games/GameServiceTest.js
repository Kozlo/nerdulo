(function() {
'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Game Service", {
        setup: function () {
            var injector = angular.injector(['ng', 'GameService']);

            this.oGameSrv = injector.get('Games');

            // TODO: move this to a test anc check if config values are correct
            this.oConfig = {
                questCount: 10,
                optCount : 4,
                deviance : {
                    min : -20,
                    max : 20
                }
            };
        },
        teardown: function() {
            // TODO: add functions to be run after the test is done
        }
    });

    //===============================
    //  General Tests
    //===============================

    test("Is the config for the answers as expected", function() {
        // TODO; refactor this
        var oExpectedConfig = {
            questCount: 10,
            optCount : this.oConfig.optCount,
            deviance : {
                min : this.oConfig.deviance.min,
                max : this.oConfig.deviance.max
            }
        };

        deepEqual(this.oGameSrv.oConfig, oExpectedConfig, "Actual and expected config match");
    });

    test("Does generateQuestions return expected questions", function() {

        var spy_getIsLast = sinon.spy(this.oGameSrv, "_getIsLast"),
            spy_getNewQuestion = sinon.spy(this.oGameSrv, "_getNewQuestion");

        var aQuests = this.oGameSrv.generateQuestions();

        ok(spy_getIsLast.called, "_getIsLast called");
        equal(spy_getIsLast.callCount, this.oGameSrv.oConfig.questCount, "_getIsLast call count equals the question count specified in the config");

        ok(spy_getNewQuestion.called, "_getNewQuestion called");

        ok(aQuests, "questions are generated");
        equal(aQuests.length, this.oGameSrv.oConfig.questCount, "correct number of questions are generated");

        spy_getIsLast.restore();
        spy_getNewQuestion.restore();
    });

    test("Does _getNewQuestion method exist", function() {
        ok(this.oGameSrv._getNewQuestion, "_getNewQuestion method exists");
    });

    test("Does _getIsLast return the indicator for the last question correctly", function() {
        var bNonLastQuestion = this.oGameSrv._getIsLast(0, 5),
            bLastQuestion = this.oGameSrv._getIsLast(4, 5),
            bWrongQuestion = this.oGameSrv._getIsLast(10, 3);

        equal(bNonLastQuestion, false, "Method returns false when the question is not the last one");
        equal(bLastQuestion, true, "Method returns true when the question is the last one");
        equal(bWrongQuestion, true, "Method returns true when the question index is above question count - 1");
    });
}());