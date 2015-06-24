(function(){
'use strict';
    module("Answer service test module", {
        setup: function () {
            var injector = angular.injector(['ng', 'CountingGameCtrl', 'AnswerService', 'AllStarService']);

            this.ansSrv = injector.get('Answers');
            this.allstars = injector.get('AllStars');

            // TODO: move this to a test anc check if config values are correct
            this.config =  {
                questCount: 10,
                falseOptCount : 5,
                minDev : -20,
                maxDev : 20,
                minNum : 11,
                maxNum : 29
            };
            this.answers = this.ansSrv.generateQuestions(this.config);
            // define all methods to test

            // TODO: think of a better way to do this
            this.oQuestion = this.answers[0];
        },
        teardown: function() {
            // TODO: add functions to be run after the test is done
        }
    });

    test('Tests for Answer Service', function() {
        // check if the generated question count is as per config
        equal(this.answers.length, this.config.questCount  , 'The specified number of questions are as expected: ' + this.config.questCount);
        // check if count of all options is as specified
        ok(answerOptionCounter(this.answers, this.config),'Generated option count for each answer matches config amount: ' + this.config.falseOptCount);
        // check if option values are of type number and and within the specified range (min, max deviation)
        ok(answerOptionChecker(this.answers, this.config),
            'Generated option values are numbers and in the range allowed by min and max deviation: ' + this.config.maxDev, + ' - ' + this.config.minDev);

        function answerOptionCounter(answers, config) {
            var correct = true;
            for (var i=0; i<answers.length; i++) {
                if (answers[i].falseOptions.length !== config.falseOptCount) {
                    equal(answers[i].options.length, config.falseOptCount, 'The number of options for answer ' + i + ' is wrong');
                    correct = false;
                }
            }
            return correct;
        }

        function answerOptionChecker(answers, config) {
            var correct = true;
            for (var i=0; i<answers.length; i++) {
                var answ = answers[i].answer;
                for (var u=0; u<answers[i].falseOptions.length; u++) {
                    var opt = answers[i].falseOptions[u];
                    // check if the option is a number and if yes, if it's in the allowed range
                    if (typeof opt !== 'number') {
                        ok(false, 'The option number ' + u + ' for answer ' + i + ' is not a number.');
                        correct = false;
                    } else {
                        var maxPossAnsw = Math.floor(answ * config.maxDev),
                            minPossAnsw = Math.floor(answ * config.minDev);
                        if (opt > maxPossAnsw || opt < minPossAnsw) {
                            correct = false;
                            ok(false, 'The option number ' + u + ' for answer ' + i + ' with value ' + opt + ' is out of the allowed range of + ' + minPossAnsw + ' - ' + maxPossAnsw)
                        }
                    }
                }
            }
            return correct;
        }
    });

    test('Tests for get random int helper method', function() {
        // test different values many times to see if it ever surpassed the specified bounds
        ok(randIntGen(1, 10, 1000, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: 1 to -10.');
        ok(randIntGen(-10, -1, 1000, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: -10 to -1.');
        ok(randIntGen(-100000, 100000, 1000, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: 1 to -10.');
        ok(randIntGen(1, 1, 1, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: 1 to 1.');
        ok(randIntGen(0, 0, 1, this.oQuestion.getRandomInt), 'Rand int passes valid values when passed: 0 to 0.');

        function randIntGen (min, max, count, getRandomInt) {
            var randInt;

            for (var i=0; i<count; i++) {
                randInt = getRandomInt(min, max);
                if (randInt < min || randInt > max) {
                    return false;
                }
            }
            return true;
        }
    });

    test('Test for calculator helper method', function() {
        // test a few number problems to see if calculator returns a correct one
        equal(this.oQuestion.calculator(2, 2), 2 * 2, 'Testing 2*2 is fine.');
        equal(this.oQuestion.calculator(999, 888), 999 * 888, 'Testing 999*888 is fine.');
        equal(this.oQuestion.calculator(1234, 4321), 1234 * 4321, 'Testing 1234*4321 is fine.');
    });

    test("Test for optionGenerator", function() {
        var spy_getRandomInt = sinon.spy(this.oQuestion, "getRandomInt");

        var aOpts = this.oQuestion.optionGenerator();

        ok(spy_getRandomInt.called, "getRandomInt called");
        ok(spy_getRandomInt.calledWith(this.oQuestion.config.deviance.min, this.oQuestion.config.deviance.max), "getRandomInt called with min and max deviance values");

        equal(aOpts.length, this.config.falseOptCount - 1, "the number of generated options equals false option count - 1");

        for (var i = 0; i < aOpts.length; i++) {
            equal(typeof aOpts[i], "number", "the type of option " + i + " is 'Number'");
            notEqual(aOpts[i], 0,  "Option " + i + " is not zero.");
            ok(aOpts[i] > Math.floor(this.oQuestion.answer * (1 + this.oQuestion.config.deviance.min)),  "Option " + i + " value is greater than minimum allowed value.");
            ok(aOpts[i] < Math.floor(this.oQuestion.answer * (1 + this.oQuestion.config.deviance.max)),  "Option " + i + " value is less than the maximum allowed value.");
        }

        var aSortedResult = aOpts.sort(),
            aDuplicates = duplicateValueFinder(aSortedResult, aOpts[i]);

        // if the length if duplicated is 0, then this should pass
        notOk(aDuplicates.length, "There are no duplicate values returned from opttion generator")


        function duplicateValueFinder(aSortedArray) {
            var results = [];
            for (var i = 0; i < aSortedArray.length - 1; i++) {
                if (aSortedArray[i + 1] == aSortedArray[i]) {
                    results.push(aSortedArray[i]);
                }
            }
            // if there are no duplicated, 0 should be returned
            return results;
        }
    });

    test("Does addAnswer method adds the correct answer to the array of generated options properly", function() {
        var aTestOpts = [1, 3, 5, 2],
            nOldLength = aTestOpts.length;

        var spy_getRandomInt = sinon.spy(this.oQuestion, "getRandomInt");

        var aOpts = this.oQuestion.addAnswer(aTestOpts);

        ok(spy_getRandomInt.called, "getRandomInt called");
        ok(spy_getRandomInt.calledWith(0, this.config.falseOptCount - 1), " getRandomInt called with 0 and false opt count - 1");

        ok(aOpts.indexOf(this.oQuestion.answer) >= 0, "The answer has been added to the options");
        equal(aOpts.length, nOldLength + 1, "The length of the returned array is larger than that of the passed one by 1");
    });

    test("Does setPlayerAnswer sets the player answer and the player prompt properly", function() {
        var nTestOpt = 2;

        this.oQuestion.setPlayerAnswer(nTestOpt);

        equal(this.oQuestion.playerAnswer, nTestOpt, "player answer property is set correctly");
        equal(this.oQuestion.playerPrompt, "Your answer is: " + nTestOpt, "player prompt property is set correctly");
    });
}());