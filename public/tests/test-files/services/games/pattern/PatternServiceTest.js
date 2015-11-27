(function() {
    'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Pattern Service", {
        setup: function () {
            var injector = angular.injector(['ng', 'PatternGameCtrl', 'PatternService', 'AllStarService']);

            this.oPtrnSrv = injector.get('Patterns');
            // TODO: figure out if this is needed at all
            this.oAllstars = injector.get('AllStars');

            this.aPatterns = this.oPtrnSrv.generatePatterns();
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
                min : -25,
                max : 25
            },
            patternCount: 10
        };

        deepEqual(this.oPtrnSrv.oConfig, oExpectedConfig, "Pattern Serciec config matches the expected config");
    });

    test("Does generatePatterns return the expected result", function() {
        var aPatterns = this.oPtrnSrv.generatePatterns();

        equal(aPatterns.length, this.oPtrnSrv.oConfig.patternCount, "Pattern count matches the amount specified in config");

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

            ok(oPattern.iAnswer, "iAnswer property exists for question " + i);
            equal(typeof oPattern.iAnswer, "number", "iAnswer property type is number for question " + i);

            ok(oPattern.oOptions, "oOptions property exists for question " + i);
            equal(typeof oPattern.oOptions, "object", "oOptions property type is object for question " + i);

            equal(oPattern.iPlayerAnswer, null, "iPlayerAnswer is initialized to null for question " + i);

            equal(oPattern.bIsCurrentQuestion, false, "bIsCurrentQuestion is initialized to false for question " + i);

            ok(oPattern.sPlayerPrompt, "sPlayerPrompt property exists for question " + i);
            equal(typeof oPattern.sPlayerPrompt, "string", "sPlayerPrompt property type is string for question " + i);
            equal(oPattern.sPlayerPrompt, "Your answer is: ", "oOptions property is seto to 'Your answer is: ' for question " + i);
        }
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
}());