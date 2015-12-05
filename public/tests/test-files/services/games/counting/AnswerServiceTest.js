(function() {
'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Answer Service", {
        setup: function () {
            var injector = angular.injector(['ng', 'CountingGameCtrl', 'AnswerService']);

            this.oAnsSrv = injector.get('Answers');

            // TODO: move this to a test anc check if config values are correct
            this.oConfig =  {
                questCount: 10,
                falseOptCount : 4,
                deviance : {
                    min : -20,
                    max : 20
                },
                number : {
                    min : 11,
                    max : 29
                }
            };

            this.aAnswers = this.oAnsSrv.generateQuestions();
            // TODO: think of a better way to do this
            this.oQuestion = this.aAnswers[0];
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
            falseOptCount : this.oConfig.falseOptCount,
            deviance : {
                min : this.oConfig.deviance.min,
                max : this.oConfig.deviance.max
            }
        };

        equal(JSON.stringify(this.oQuestion.oConfig), JSON.stringify(oExpectedConfig), "Actual and expected config match");
    });

    test("Does generateQuestions return expected questions", function() {

        var spy_getIsLast = sinon.spy(this.oAnsSrv, "_getIsLast"),
            spy_getNewQuestion = sinon.spy(this.oAnsSrv, "_getNewQuestion");

        var aQuests = this.oAnsSrv.generateQuestions();

        ok(spy_getIsLast.called, "_getIsLast called");
        equal(spy_getIsLast.callCount, this.oAnsSrv.oConfig.questCount, "_getIsLast call count equals the question count specified in the config");

        ok(spy_getNewQuestion.called, "_getNewQuestion called");

        ok(aQuests, "questions are generated");
        equal(aQuests.length, this.oAnsSrv.oConfig.questCount, "correct number of questions are generated");

        spy_getIsLast.restore();
        spy_getNewQuestion.restore();
    });

    test("Does _getNewQuestion return properly constructed questions given different input", function() {
        var oNonLastQuest = this.oAnsSrv._getNewQuestion(0, this.oAnsSrv.oConfig, false),
            oLastQuest = this.oAnsSrv._getNewQuestion(0, this.oAnsSrv.oConfig, true);

        equal(oNonLastQuest.bIsLast, false, "the non last question's bIsLast property is set to false");
        equal(oLastQuest.bIsLast, true, "the last question's bIsLast property is set to true");
    });

    test("Does _getIsLast return the indicator for the last question correctly", function() {

        var bNonLastQuestion = this.oAnsSrv._getIsLast(0, 5),
            bLastQuestion = this.oAnsSrv._getIsLast(4, 5),
            bWrongQuestion = this.oAnsSrv._getIsLast(10, 3);

        equal(bNonLastQuestion, false, "Method returns false when the question is not the last one");
        equal(bLastQuestion, true, "Method returns true when the question is the last one");
        equal(bWrongQuestion, true, "Method returns true when the question index is above question count - 1");
    });

    //===============================
    //  Public Method Tests
    //===============================

    test('Are answers generated properly', function() {
        var sDefaultPlayerPrompt = "Your answer is: ";

        // check if the generated question count is as per config
        equal(this.aAnswers.length, this.oConfig.questCount  , 'The specified number of questions are as expected: ' + this.oConfig.questCount);
        // check if count of all options is as specified
        ok(answerOptionCounter(this.aAnswers, this.oConfig),'Generated option count for each answer matches config amount: ' + this.oConfig.falseOptCount);
        // check if option values are of type number and and within the specified range (min, max deviation)
        ok(answerOptionChecker(this.aAnswers, this.oConfig),
            'Generated option values are numbers and in the range allowed by min and max deviation: ' + this.oConfig.deviance.max, + ' - ' + this.oConfig.deviance.min);

        // check if properties are set
        notEqual(this.oQuestion.bIsCurr, "undefined", "Question property bIsCurr is set");
        equal(this.oQuestion.bIsCurr, false, "Question property bIsCurr is set to false");

        notEqual(this.oQuestion.bIsLast, "undefined", "Question property bIsLast is set");

        for (var i = 0; i < this.aAnswers.length; i++) {
            if ((i + 1) < this.aAnswers.length) {
                equal(this.aAnswers[i].bIsLast, false, "Question property bIsLast is set to false for non-last question:, indes: " + i);
            } else {
                equal(this.aAnswers[i].bIsLast, true, "Question property bIsLast is set to true for the last question, index: " + i);
            }
        }

        notEqual(this.oQuestion.iPlayerAnswer, "undefined", "Question property iPlayerAnswer is set");
        equal(this.oQuestion.iPlayerAnswer, null, "Question property iPlayerAnswer is set to null");

        notEqual(this.oQuestion.sPlayerPrompt, "undefined", "Question property sPlayerPrompt is set");
        equal(this.oQuestion.sPlayerPrompt, sDefaultPlayerPrompt, "Question property sPlayerPrompt is set to the default one");

        function answerOptionCounter(aAnswers, oConfig) {
            var bCorrect = true;

            for (var i = 0; i < aAnswers.length; i++) {
                if (aAnswers[i].aFalseOptions.length !== oConfig.falseOptCount) {
                    equal(aAnswers[i].aOptions.length, oConfig.falseOptCount + 1, 'The number of options for answer ' + i + ' is wrong');
                    bCorrect = false;
                }
            }
            return bCorrect;
        }

        function answerOptionChecker(aAnswers, oConfig) {
            var bCorrect = true;

            for (var i=0; i < aAnswers.length; i++) {
                var nAnsw = aAnswers[i].answer;

                for (var u = 0; u < aAnswers[i].aFalseOptions.length; u++) {
                    var nOpt = aAnswers[i].aFalseOptions[u];

                    // check if the option is a number and if yes, if it's in the allowed range
                    if (typeof nOpt !== 'number') {
                        ok(false, 'The option number ' + u + ' for answer ' + i + ' is not a number.');
                        bCorrect = false;
                    } else {
                        var nMaxPossAnsw = Math.floor(nAnsw * oConfig.deviance.max),
                            nMinPossAnsw = Math.floor(nAnsw * oConfig.deviance.min);

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

        function randIntGen (iMin, iMax, iCount, fnGetRandomInt) {
            var iRandInt;

            for (var i = 0; i < iCount; i++) {
                iRandInt = fnGetRandomInt(iMin, iMax);

                if (iRandInt < iMin || iRandInt > iMax) {
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
        var spy_createOption = sinon.spy(this.oQuestion, "createOption");

        var aOpts = this.oQuestion.optionGenerator();

        ok(spy_createOption.called, "createOption called");
        ok(spy_createOption.callCount >= this.oConfig.falseOptCount, "getRandomInt called at least the same amount of times as there are false options");

        equal(aOpts.length, this.oConfig.falseOptCount, "the number of generated options equals false option count specified in the config");

        for (var i = 0; i < aOpts.length; i++) {
            equal(typeof aOpts[i], "number", "the type of option " + i + " is 'Number'");
            notEqual(aOpts[i], 0,  "Option " + i + " is not zero.");
            ok(aOpts[i] > Math.floor(this.oQuestion.iAnswer * (1 + this.oQuestion.oConfig.deviance.min)),  "Option " + i + " value is greater than minimum allowed value.");
            ok(aOpts[i] < Math.floor(this.oQuestion.iAnswer * (1 + this.oQuestion.oConfig.deviance.max)),  "Option " + i + " value is less than the maximum allowed value.");
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

        spy_createOption.restore();
    });

    test("Does createOption call the necessary methods and generate an option properly", function() {
        var aTestOpts = ["test"];

        var spy_getRandomOption = sinon.spy(this.oQuestion, "getRandomOption");

        this.oQuestion.createOption(aTestOpts);

        ok(spy_getRandomOption.called, "getRandomOption called");

        equal(aTestOpts.length, 2, "the passed array has an additional value");

        spy_getRandomOption.restore();
    });

    test("Does pushUniqueValueToArray adds only unique values to array", function() {
        var aTestArray = [],
            sTestVal1 = "val1",
            sTestVal2 = "val2";

        this.oQuestion.pushUniqueValueToArray(aTestArray, sTestVal1);
        this.oQuestion.pushUniqueValueToArray(aTestArray, sTestVal1);
        this.oQuestion.pushUniqueValueToArray(aTestArray, sTestVal2);

        equal(aTestArray.length, 2, "the passed array's length is only 2 since only unique values should be added");
        equal(aTestArray[0], sTestVal1, "the array's first value is the first that was passed");
        equal(aTestArray[1], sTestVal2, "the array's second value is the first that was passed");
    });

    test("Does getRandomOption create and return a valid number", function() {
        var spy_getNonZeroRandomInt = sinon.spy(this.oQuestion, "getNonZeroRandomInt"),
            spy_processRandomOption = sinon.spy(this.oQuestion, "processRandomOption");

        this.oQuestion.getRandomOption();

        ok(spy_getNonZeroRandomInt.called, "getNonZeroRandomInt");
        ok(spy_getNonZeroRandomInt.calledWith(this.oConfig.deviance.min, this.oConfig.deviance.max), "getNonZeroRandomInt called with deviance min and max values");

        ok(spy_processRandomOption.called, "processRandomOption called");
        // TODO: figure out how to get the return value of spy
        ok(spy_processRandomOption.calledWith(this.oQuestion.iAnswer, sinon.match.any), "processRandomOption called with the answer and thr return value of get non zero random int");

        spy_getNonZeroRandomInt.restore();
        spy_processRandomOption.restore();
    });

    test("Does processRandomOption formats the passed value correctltly", function() {
        var iTestDev = 20,
            iExpRandOpt = this.oQuestion.iAnswer * this.oQuestion.convertNumToMultiple(iTestDev),
            iExpResult = Math.floor(iExpRandOpt);

        var spy_convertNumToMultiple = sinon.spy(this.oQuestion, "convertNumToMultiple"),
            spy_MathFloor = sinon.spy(Math, "floor");

        var iOpt = this.oQuestion.processRandomOption(this.oQuestion.iAnswer, iTestDev);

        ok(spy_convertNumToMultiple.called, "convertNumToMltpl called");

        ok(spy_MathFloor.called, "MathFloor called");
        ok(spy_MathFloor.calledWith(iExpRandOpt), "MathFloor called with the generated random option");

        equal(iOpt, iExpResult, "The result is as exoected");

        spy_convertNumToMultiple.restore();
        spy_MathFloor.restore();
    });

    test("Does convertNumToMultiple convert a number to a fraction (divided by 100) + 1", function() {
        var iTestNum1 = 3,
            iTestNum2 = 5,
            iTestNum3 = -55;

        var iMult1 = this.oQuestion.convertNumToMultiple(iTestNum1),
            iMult2 = this.oQuestion.convertNumToMultiple(iTestNum2),
            iMult3 = this.oQuestion.convertNumToMultiple(iTestNum3);

        equal(iMult1, 1 + iTestNum1 / 100, "The first number " + iTestNum1 + " is converted correctly: " + iMult1);
        equal(iMult2, 1 + iTestNum2 / 100, "The first number " + iTestNum2 + " is converted correctly: " + iMult2);
        equal(iMult3, 1 + iTestNum3 / 100, "The first number " + iTestNum3 + " is converted correctly: " + iMult3);
    });

    test("Does addAnswer method adds the correct answer to the array of generated options properly", function() {
        var aTestOpts = [1, 3, 5, 2],
            nOldLength = aTestOpts.length;

        var spy_getRandomInt = sinon.spy(this.oQuestion, "getRandomInt"),
            spy_insertValueInArray = sinon.spy(this.oQuestion, "insertValueInArray");

        var aOpts = this.oQuestion.addAnswer(aTestOpts);

        ok(spy_getRandomInt.called, "getRandomInt called");
        ok(spy_getRandomInt.calledWith(0, this.oConfig.falseOptCount - 1), " getRandomInt called with 0 and false opt count - 1");

        ok(spy_insertValueInArray.called, "insertValueInArray called");
        ok(spy_insertValueInArray.calledWith(aOpts, sinon.match.any), "insertValueInArray called");

        ok(aOpts.indexOf(this.oQuestion.iAnswer) >= 0, "The answer has been added to the options");
        equal(aOpts.length, nOldLength + 1, "The length of the returned array is larger than that of the passed one by 1");

        spy_getRandomInt.restore();
        spy_insertValueInArray.restore();
    });

    test("Does setPlayerAnswer sets the player answer and the player prompt properly", function() {
        var iTestOpt = 2;

        this.oQuestion.setPlayerAnswer(iTestOpt);

        equal(this.oQuestion.iPlayerAnswer, iTestOpt, "player answer property is set correctly");
        equal(this.oQuestion.sPlayerPrompt, "Your answer is: " + iTestOpt, "player prompt property is set correctly");
    });
}());