(function() {
'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Answer Service", {
        setup: function () {
            var injector = angular.injector(['ng', 'CountingGameCtrl', 'AnswerService', 'AllStarService']);

            this.oAnsSrv = injector.get('Answers');
            // TODO: figure out if this is needed at all
            this.oAllstars = injector.get('AllStars');

            // TODO: move this to a test anc check if config values are correct
            this.oConfig =  {
                questCount: 10,
                falseOptCount : 5,
                minDev : -20,
                maxDev : 20,
                minNum : 11,
                maxNum : 29
            };

            this.aAnswers = this.oAnsSrv.generateQuestions(this.oConfig);
            // define all methods to test

            // TODO: think of a better way to do this
            this.oQuestion = this.aAnswers[0];
        },
        teardown: function() {
            // TODO: add functions to be run after the test is done
        }
    });

    //===============================
    //  Public Method Tests
    //===============================

    test('Are answers generated properly', function() {
        // check if the generated question count is as per config
        equal(this.aAnswers.length, this.oConfig.questCount  , 'The specified number of questions are as expected: ' + this.oConfig.questCount);
        // check if count of all options is as specified
        ok(answerOptionCounter(this.aAnswers, this.oConfig),'Generated option count for each answer matches config amount: ' + this.oConfig.falseOptCount);
        // check if option values are of type number and and within the specified range (min, max deviation)
        ok(answerOptionChecker(this.aAnswers, this.oConfig),
            'Generated option values are numbers and in the range allowed by min and max deviation: ' + this.oConfig.maxDev, + ' - ' + this.oConfig.minDev);

        function answerOptionCounter(aAnswers, oConfig) {
            var bCorrect = true;

            for (var i = 0; i < aAnswers.length; i++) {
                if (aAnswers[i].aFalseOptions.length !== oConfig.falseOptCount) {
                    equal(aAnswers[i].aOptions.length, oConfig.falseOptCount, 'The number of options for answer ' + i + ' is wrong');
                    bCorrect = false;
                }
            }
            return bCorrect;
        }

        function answerOptionChecker(aAnswers, oConfig) {
            var bCorrect = true;

            for (var i=0; i < aAnswers.length; i++) {
                var nAnsw = aAnswers[i].answer;

                // TODO: consider refactoring this
                for (var u = 0; u < aAnswers[i].aFalseOptions.length; u++) {
                    var nOpt = aAnswers[i].aFalseOptions[u];

                    // check if the option is a number and if yes, if it's in the allowed range
                    if (typeof nOpt !== 'number') {
                        ok(false, 'The option number ' + u + ' for answer ' + i + ' is not a number.');
                        bCorrect = false;
                    } else {
                        var nMaxPossAnsw = Math.floor(nAnsw * oConfig.maxDev),
                            nMinPossAnsw = Math.floor(nAnsw * oConfig.minDev);
                        if (nOpt > nMaxPossAnsw || nOpt < nMinPossAnsw) {
                            bCorrect = false;
                            ok(false, 'The option number ' + u + ' for answer ' + i + ' with value ' + nOpt + ' is out of the allowed range of + ' + nMinPossAnsw + ' - ' + nMaxPossAnsw)
                        }
                    }
                }
            }

            return bCorrect;
        }
    });


    //===============================
    //  Private Method Tests
    //===============================

    test('Does getRandomInt generate an integer given different input', function() {
        // test different values many times to see if it ever surpassed the specified bounds
        ok(randIntGen(1, 10, 1000, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: 1 to -10.');
        ok(randIntGen(-10, -1, 1000, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: -10 to -1.');
        ok(randIntGen(-100000, 100000, 1000, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: 1 to -10.');
        ok(randIntGen(1, 1, 1, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: 1 to 1.');
        ok(randIntGen(0, 0, 1, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: 0 to 0.');

        function randIntGen (nMin, nMax, nCount, fnGetRandomInt) {
            var nRandInt;

            for (var i = 0; i < nCount; i++) {
                nRandInt = fnGetRandomInt(nMin, nMax);

                if (nRandInt < nMin || nRandInt > nMax) {
                    return false;
                }
            }

            return true;
        }
    });

    test('Does calculator return a correct answer', function() {
        // test a few number problems to see if calculator returns a correct one
        equal(this.oQuestion.calculator(2, 2), 2 * 2, 'Testing 2*2 is fine.');
        equal(this.oQuestion.calculator(999, 888), 999 * 888, 'Testing 999*888 is fine.');
        equal(this.oQuestion.calculator(1234, 4321), 1234 * 4321, 'Testing 1234*4321 is fine.');
    });

    test("Does optionGenerator generate valid answer options", function() {
        var spy_getRandomInt = sinon.spy(this.oQuestion, "getRandomInt");

        var aOpts = this.oQuestion.optionGenerator();

        ok(spy_getRandomInt.called, "getRandomInt called");
        ok(spy_getRandomInt.calledWith(this.oQuestion.oConfig.deviance.min, this.oQuestion.oConfig.deviance.max), "getRandomInt called with min and max deviance values");

        equal(aOpts.length, this.oConfig.falseOptCount - 1, "the number of generated options equals false option count - 1");

        for (var i = 0; i < aOpts.length; i++) {
            equal(typeof aOpts[i], "number", "the type of option " + i + " is 'Number'");
            notEqual(aOpts[i], 0,  "Option " + i + " is not zero.");
            ok(aOpts[i] > Math.floor(this.oQuestion.nAnswer * (1 + this.oQuestion.oConfig.deviance.min)),  "Option " + i + " value is greater than minimum allowed value.");
            ok(aOpts[i] < Math.floor(this.oQuestion.nAnswer * (1 + this.oQuestion.oConfig.deviance.max)),  "Option " + i + " value is less than the maximum allowed value.");
        }

        var aSortedResult = aOpts.sort(),
            aDuplicates = duplicateValueFinder(aSortedResult, aOpts[i]);

        // if the length if duplicated is 0, then this should pass
        notOk(aDuplicates.length, "There are no duplicate values returned from opttion generator")


        function duplicateValueFinder(aSortedArray) {
            var aResults = [];

            for (var i = 0; i < aSortedArray.length - 1; i++) {
                if (aSortedArray[i + 1] == aSortedArray[i]) {
                    aResults.push(aSortedArray[i]);
                }
            }

            // if there are no duplicated, 0 should be returned
            return aResults;
        }
    });

    test("Does addAnswer method adds the correct answer to the array of generated options properly", function() {
        var aTestOpts = [1, 3, 5, 2],
            nOldLength = aTestOpts.length;

        var spy_getRandomInt = sinon.spy(this.oQuestion, "getRandomInt");

        var aOpts = this.oQuestion.addAnswer(aTestOpts);

        ok(spy_getRandomInt.called, "getRandomInt called");
        ok(spy_getRandomInt.calledWith(0, this.oConfig.falseOptCount - 1), " getRandomInt called with 0 and false opt count - 1");

        ok(aOpts.indexOf(this.oQuestion.nAnswer) >= 0, "The answer has been added to the options");
        equal(aOpts.length, nOldLength + 1, "The length of the returned array is larger than that of the passed one by 1");
    });

    test("Does setPlayerAnswer sets the player answer and the player prompt properly", function() {
        var nTestOpt = 2;

        this.oQuestion.setPlayerAnswer(nTestOpt);

        equal(this.oQuestion.nPlayerAnswer, nTestOpt, "player answer property is set correctly");
        equal(this.oQuestion.sPlayerPrompt, "Your answer is: " + nTestOpt, "player prompt property is set correctly");
    });
}());