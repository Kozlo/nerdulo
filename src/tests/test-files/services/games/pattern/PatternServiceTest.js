(function() {
    'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Pattern Service", {
        setup: function () {
            var injector = angular.injector(['ng', 'GameService', 'PatternService']);

            this.oPtrnSrv = injector.get('Patterns');

            this.aPatterns = this.oPtrnSrv.generateQuestions();
            // TODO: think of a better way to do this
            this.oPattern = this.aPatterns[0];
        },
        teardown: function () {
            // TODO: add functions to be run after the test is done
        }
    });

    //===============================
    //  General Tests
    //===============================

    test("Is the config for the answers as expected", function () {
        var oExpectedConfig = {
            questCount: 10,
            startNum : {
                min : 9,
                max : 15
            },
            multiple : {
                min : 2,
                max : 3
            },
            constant : {
                min : -20,
                max : 20
            },
            itemCount : 5,
            optCount : 5,
            deviance : {
                min : -20,
                max : 20
            }
        };

        deepEqual(this.oPtrnSrv.oConfig, oExpectedConfig, "Pattern Serciec config matches the expected config");
    });

    test("Does generateQuestions return the expected result", function() {
        var spy_getIsLast = sinon.spy(this.oPtrnSrv, "_getIsLast"),
            spy_getNewQuestion = sinon.spy(this.oPtrnSrv, "_getNewQuestion");

        var aPatterns = this.oPtrnSrv.generateQuestions();

        equal(aPatterns.length, this.oPtrnSrv.oConfig.questCount, "Pattern count matches the amount specified in config");

        for (var i = 0; i < aPatterns.length; i++) {
            var oPattern = aPatterns[i],
                oConfig = oPattern.oConfig;

            equal(oPattern.qNo, i, "The qNo property for question " + i + " number is " + i);

            // check all config properties
            equal(typeof oConfig.startNum, "number", "The startNum property type for question " + i + " is number");
            equal(typeof oConfig.multiple, "number", "The multiple property type for question " + i + " is number");
            equal(typeof oConfig.constant, "number", "The constant property type for question " + i + " is number");
            equal(oConfig.itemCount, this.oPattern.oConfig.itemCount, "The startNum property type for question " + i + " matches the configuration");
            equal(oConfig.optCount, this.oPattern.oConfig.optCount, "The startNum property type for question " + i + " matches the configuration");
            equal(typeof oConfig.deviance, "object", "The startNum property type for question " + i + " is Object");
            equal(oConfig.deviance.min, this.oPattern.oConfig.deviance.min, "The deviance.min property for question " + i + " matches the configuration");
            equal(oConfig.deviance.max, this.oPattern.oConfig.deviance.max, "The deviance.min property for question " + i + " matches the configuration");

            // check all properties
            ok(oPattern.aPattern, "aPattern property exists for question " + i);
            ok(Array.isArray(oPattern.aPattern), "aPattern property is array for question " + i);

            ok(oPattern.aPattern, "aPattern property exists for question " + i);
            ok(Array.isArray(oPattern.aPattern), "aPattern property is array for question " + i);

            notEqual(typeof oPattern.iAnswer, "undefined", "iAnswer property exists for question " + i);
            equal(typeof oPattern.iAnswer, "number", "iAnswer property type is number for question " + i);

            ok(oPattern.oOptions, "oOptions property exists for question " + i);
            equal(typeof oPattern.oOptions, "object", "oOptions property type is object for question " + i);

            equal(oPattern.iPlayerAnswer, null, "iPlayerAnswer is initialized to null for question " + i);

            equal(oPattern.bIsCurr, false, "bIsCurrentQuestion is initialized to false for question " + i);

            if (i < (aPatterns.length - 1)) {
                equal(oPattern.bIsLast, false, "bIsLast set to false for question " + i);
            } else {
                equal(oPattern.bIsLast, true, "bIsLast set to true for question " + i);
            }

            ok(oPattern.sPlayerPrompt, "sPlayerPrompt property exists for question " + i);
            equal(typeof oPattern.sPlayerPrompt, "string", "sPlayerPrompt property type is string for question " + i);
            equal(oPattern.sPlayerPrompt, "Your answer is: ", "oOptions property is seto to 'Your answer is: ' for question " + i);

            notEqual(typeof oPattern.iOptionValueNorm, "undefined", "iOptionValueNorm property exists for question " + i);
            equal(typeof oPattern.iOptionValueNorm, "number", "iOptionValueNorm property type is number for question " + i);
            equal(oPattern.iOptionValueNorm, 30, "iOptionValueNorm property value is 30 for question " + i);
        }

        var iLastPatternIndex = aPatterns.length - 1;
        equal(aPatterns[iLastPatternIndex].bIsLast, true, "bIsLast set to true for the last question, question number  " + iLastPatternIndex);

        ok(spy_getIsLast.called, "_getIsLast called");
        equal(spy_getIsLast.callCount, this.oPtrnSrv.oConfig.questCount, "_getIsLast call count equals the question count specified in the config");

        ok(spy_getNewQuestion.called, "_getNewQuestion called");

        spy_getIsLast.restore();
        spy_getNewQuestion.restore();
    });

    test("Does _getNewQuestion return properly constructed patterns given different input", function() {
        var oNonLastQuest = this.oPtrnSrv._getNewQuestion(0, this.oPtrnSrv.oConfig, false),
            oLastQuest = this.oPtrnSrv._getNewQuestion(0, this.oPtrnSrv.oConfig, true);

        equal(oNonLastQuest.bIsLast, false, "the non last pattern's bIsLast property is set to false");
        equal(oLastQuest.bIsLast, true, "the last pattern's bIsLast property is set to true");
    });

    test("Does _getIsLast return the indicator for the last question correctly", function() {

        var bNonLastQuestion = this.oPtrnSrv._getIsLast(0, 5),
            bLastQuestion = this.oPtrnSrv._getIsLast(4, 5),
            bWrongQuestion = this.oPtrnSrv._getIsLast(10, 3);

        equal(bNonLastQuestion, false, "Method returns false when the question is not the last one");
        equal(bLastQuestion, true, "Method returns true when the question is the last one");
        equal(bWrongQuestion, true, "Method returns true when the question index is above question count - 1");
    });

    //===============================
    //  Private Pattern Method Tests
    //===============================

    test('Does _getRandomInt generate an integer given different input', function() {
        // test different values many times to see if it ever surpassed the specified bounds
        ok(randIntGen(1, 10, 1000, this.oPattern._getRandomInt), 'Rand int passes valid values when passed: 1 to -10.');
        ok(randIntGen(-10, -1, 1000, this.oPattern._getRandomInt), 'Rand int passes valid values when passed: -10 to -1.');
        ok(randIntGen(-100000, 100000, 1000, this.oPattern._getRandomInt), 'Rand int passes valid values when passed: 1 to -10.');
        ok(randIntGen(1, 1, 1, this.oPattern._getRandomInt), 'Rand int passes valid values when passed: 1 to 1.');
        ok(randIntGen(0, 0, 1, this.oPattern._getRandomInt), 'Rand int passes valid values when passed: 0 to 0.');

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

    test("Does _patternGenerator generate patterns correctly", function() {
        var aExpectedPattern = [];

        aExpectedPattern.push(this.oPattern.oConfig.startNum);

        // generate item count - 1 as the first one is already set
        for (var i=0; i < this.oPattern.oConfig.itemCount - 1; i++) {
            aExpectedPattern.push(aExpectedPattern[i] * this.oPattern.oConfig.multiple + this.oPattern.oConfig.constant);
        }

        var aActualPatterns = this.oPattern._patternGenerator();

        deepEqual(aActualPatterns, aExpectedPattern, "Patterns are generated correctly");
    });

    test("Does _hideOption returns the correct answer and hides it in the pattern", function() {
        var iNotSoRandomInt = 2,
            iExpectedAnswer = this.oPattern.aPattern[iNotSoRandomInt];

        var stub_getRandomInt = sinon.stub(this.oPattern, "_getRandomInt").returns(iNotSoRandomInt);

        var iActualAnswer = this.oPattern._hideOption();

        ok(stub_getRandomInt.called, "_getRandomInt called");
        ok(stub_getRandomInt.calledWith(1, this.oPattern.oConfig.itemCount - 1), "_getRandomInt called");

        equal(iExpectedAnswer, iActualAnswer, "The correct answer is returned");

        equal(this.oPattern.aPattern[iNotSoRandomInt], "?", "The correct answer has been replaced with a question mark in the pattern");

        stub_getRandomInt.restore();
    });

    test("Does _optionGenerator return correctly generated options", function() {
        var iRequiredOptionCount = this.oPattern.oConfig.optCount - 1;

        var spy_getRandomOption = sinon.spy(this.oPattern, "_getRandomOption"),
            spy_addOptionToArray = sinon.spy(this.oPattern, "_addOptionToArray"),
            spy_addAnswer = sinon.spy(this.oPattern, "_addAnswer");

        var aOptions = this.oPattern._optionGenerator(iRequiredOptionCount);

        ok(spy_getRandomOption.called, "_getRandomOption called");
        ok(spy_getRandomOption.calledWith(this.oPattern.iAnswer, this.oPattern.iOptionValueNorm), "_getRandomOption called with the answer and value norm");
        ok(spy_getRandomOption.callCount >= iRequiredOptionCount, "_getRandomOption call count is equal or greater than the specified required option count");

        ok(spy_addOptionToArray.called, "_addOptionToArray called");
        ok(spy_addOptionToArray.calledWith(sinon.match.number, sinon.match.array), "_addOptionToArray called with 2 arguments - a number and an array");
        ok(spy_addOptionToArray.callCount >= iRequiredOptionCount,"_addOptionToArray call count is equal or greater than the specified required option count");

        ok(spy_addAnswer.called, "_addAnswer called");
        ok(spy_addAnswer.calledWith(this.oPattern.iAnswer, this.oPattern.oConfig.optCount - 1, sinon.match.array), "_addAnswer called with answer, opt count -1, and an array");

        equal(aOptions.length, iRequiredOptionCount + 1, "returned option count equals the specified count + 1 for the answer");

        // check that each option is within the specified range
        for (var i = 0; i < aOptions.length; i++) {
            equal(typeof aOptions[i], "number", " the type for option " + i + " is number");
            notEqual(aOptions[i], 0, "Pattern " + i + " is not 0");
        }

        spy_getRandomOption.restore();
        spy_addOptionToArray.restore();
        spy_addAnswer.restore();
    });

    test("Does _getRandomOption return proper option when answer is above 30", function() {
        var iAnswer = 40,
            iNorm = 30,
            sRandDev = "randDev",
            sRandOpt = "randOpt";

        var stub_getRandomInt = sinon.stub(this.oPattern, "_getRandomInt").returns(sRandDev),
            stub_convertDevToOption = sinon.stub(this.oPattern, "_convertDevToOption").returns(sRandOpt);

        var iOpt = this.oPattern._getRandomOption(iAnswer, iNorm);

        ok(stub_getRandomInt.called, "_getRandomInt called");
        ok(stub_getRandomInt.calledOnce, "_getRandomInt called once");
        ok(stub_getRandomInt.calledWith(this.oPattern.oConfig.deviance.min, this.oPattern.oConfig.deviance.max), "_getRandomInt called with min and max deviance");

        ok(stub_convertDevToOption.called, "_convertDevToOption called");
        ok(stub_convertDevToOption.calledWith(sRandDev), "_convertDevToOption called with the return value of get random int");

        equal(iOpt, sRandOpt, "the return value for convert dev to option value is returned");

        stub_getRandomInt.restore();
        stub_convertDevToOption.restore();
    });

    test("Does _getRandomOption return proper option when answer is below 30", function() {
        var iAnswer = 25,
            iNorm = 30,
            sRandOpt = "randOpt";

        var stub_getRandomInt = sinon.stub(this.oPattern, "_getRandomInt").returns(sRandOpt),
            stub_convertDevToOption = sinon.stub(this.oPattern, "_convertDevToOption");

        var iOpt = this.oPattern._getRandomOption(iAnswer, iNorm);

        ok(stub_getRandomInt.called, "_getRandomInt called");
        ok(stub_getRandomInt.calledOnce, "_getRandomInt called once");
        ok(stub_getRandomInt.calledWith(-iNorm, iNorm), "_getRandomInt called with negative and positive iOptionValueNorm");

        ok(stub_convertDevToOption.notCalled, "_convertDevToOption not called");

        equal(iOpt, sRandOpt, "the return value for convert dev to option value is returned");

        stub_getRandomInt.restore();
        stub_convertDevToOption.restore();
    });

    test("Does _convertDevToOption converts the passed variable correctly: ", function() {
        var iRandDev = 5,
            iExpRandDev = Math.floor(this.oPattern.iAnswer * (1 + iRandDev / 100));

        var iOption = this.oPattern._convertDevToOption(iRandDev);

        equal(iOption, iExpRandDev, "option generated correctly");
    });

    test("Does _addAnswer add the correct answer to the passed array", function() {
        ok(true);
    });

    test("Does setPlayerAnswer change the controller properties as expected", function() {
        // TODO: try to stub properties, so that inthe test they wouldn't actually be changed
        // TODO: also test if changing them here messes up tests elsewhere
        ok(true);
    });

    test("Does _adOptionToArray only add options is the option is not already in the array and is not 0", function() {
        var iOpt1 = -55,
            iOpt2 = 25,
            iOpt3 = 1555,
            iOpt4 = 0,
            iOpt5 = 25,
            aValidOpts = [iOpt1, iOpt2, iOpt3],
            aInvalidOpts = [iOpt4, iOpt5],
            aOpts = [];

        this.oPattern._addOptionToArray(aValidOpts[0], aOpts);
        this.oPattern._addOptionToArray(aValidOpts[1], aOpts);
        this.oPattern._addOptionToArray(aValidOpts[2], aOpts);
        this.oPattern._addOptionToArray(aInvalidOpts[0], aOpts);
        this.oPattern._addOptionToArray(aInvalidOpts[1], aOpts);

        equal(aOpts.length, 3, "All valid options have been added");
        deepEqual(aOpts, aValidOpts, "All valid options have been added");
    });

    test("Does _addAnswer add the answer to the passed array", function() {
        var aOpts = [11, 2, 55, -10],
            iOldOptsLength = aOpts.length,
            iAnswerIndex = 3,
            iOptLastIndex = this.oPattern.optCount - 1,
            iAnswer = 5;

        var stub_getRandomInt = sinon.stub(this.oPattern, "_getRandomInt").returns(iAnswerIndex);

        this.oPattern._addAnswer(iAnswer, iOptLastIndex, aOpts);

        ok(stub_getRandomInt.called, "_getRandomInt called");
        ok(stub_getRandomInt.calledWith(0, this.oPattern.optCount - 1), "_getRandomInt called with args 0 and the option count - 1");

        equal(aOpts.length, iOldOptsLength + 1, "The passed array length is increased by 1");
        equal(aOpts.indexOf(iAnswer), iAnswerIndex, "The answer index is the one specified by get random int stub");

        stub_getRandomInt.restore();
    });

    test("Does setPlayerAnswer sets the player answer correctly", function() {
        var iOpt = 5;

        this.oPattern.setPlayerAnswer(iOpt);

        equal(this.oPattern.iPlayerAnswer, iOpt, "The player answer property has been set to the passed option");
        equal(this.oPattern.sPlayerPrompt, "Your answer is: " + iOpt, "The player prompt property has been set to 'Your answer is: ' + the passed option");
    });
}());