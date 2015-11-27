angular.module('PatternService', [])

    .service('Patterns', function() {

        // TODO: sort these according to difficulty
        this.oConfig = {
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

        this.generatePatterns = function() {
            var aQuestions= [];

            for (var i = 0 ; i < this.oConfig.patternCount; i++) {
                var oPattern = new Pattern(i, this.oConfig);

                aQuestions.push(oPattern);
            }

            return aQuestions;
        };

        function Pattern(qNo, oConfig) {
            this.qNo = qNo;
            this.oConfig = {
                startNum: this._getRandomInt(oConfig.startNum.min, oConfig.startNum.max),
                multiple: this._getRandomInt(oConfig.multiple.min, oConfig.multiple.max),
                constant: this._getRandomInt(oConfig.constant.min, oConfig.constant.max),
                itemCount: oConfig.itemCount,
                optCount : oConfig.optCount,
                deviance : {
                    min: oConfig.deviance.min,
                    max: oConfig.deviance.max
                }
            };
            this.aPattern = this._patternGenerator();
            // the answer is omitted and replaced with options
            this.iAnswer = this._hideOption();
            this.oOptions = this._optionGenerator();
            this.iPlayerAnswer = null;
            this.bIsCurrentQuestion = false;
            this.sPlayerPrompt = "Your answer is: ";
        }
        //
        Pattern.prototype = {
            /** TODO: move to a different service and also use in counting game
             * Returns a random integer between min (inclusive) and max (inclusive)
             * Using Math.round() will give you a non-uniform distribution!
             */
            _getRandomInt : function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            /**
             * Generated an array with numbers following a pattern
             * @return {Array} pattern
             */
            _patternGenerator : function() {
                // initialize the pattern item array with the starting number as the first item
                var pattern = [];
                pattern.push(this.oConfig.startNum);
                // generate item count - 1 as the first one is already set
                for (var i=0; i < this.oConfig.itemCount - 1; i++) {
                    pattern.push(pattern[i] * this.oConfig.multiple + this.oConfig.constant);
                }
                return pattern;
            },
            /**
             * Hide a random option from the pattern (except for the first one as it's a single digit number)
             */
            _hideOption : function() {
                var hiddenOptNo = this._getRandomInt(1, this.oConfig.itemCount - 1),
                    answer = this.aPattern[hiddenOptNo];

                this.aPattern[hiddenOptNo] = "?";

                return answer;
            },
            /** TODO: move to a separate service (here it's different than in the counting game)
             * Generates the specified amount of incorrect answers to the math problem.
             * Makes sure thspotat the specified answer isn't equal to the answer
             * @return {Array} options
             */
            _optionGenerator : function() {
                // an array to hold all answers
                var opts = [];
                do {
                    var randOpt;
                    if (this.iAnswer > 30) {
                        // generate a random number that is different from the correct answer by max % specified by the maxDev variable
                        var randDev = this._getRandomInt(this.oConfig.deviance.min, this.oConfig.deviance.max);
                        randOpt = Math.floor(this.iAnswer * (1 + randDev/100));
                    } else {
                        randOpt = this._getRandomInt(-this.oConfig.optCount, this.oConfig.optCount);
                    }
                    // make sure the option is not 0
                    if (randOpt === 0) {
                        continue;
                    }
                    // check if the option already is in the list
                    if (opts.indexOf(randOpt) < 0) {
                        //push the non-zero option to the list of available options
                        opts.push(randOpt);
                    }
                } while (opts.length < this.oConfig.optCount - 1)
                // return the options, but add the correct answer to the list first
                return this._addAnswer(opts);
            },
            /** TODO: move to a seaprate service
             * Add the correct answer at a random position in the list of options
             */
            _addAnswer : function(opts) {
                //generate a random int (0 till options count) that will be the position of the correct answer in the options
                var randPos = this._getRandomInt(0, this.oConfig.optCount - 1);
                // if the new position is at the end of the array, just add it, otherwise replace it with an incorrect answer
                if (randPos === (this.oConfig.optCount - 1)) {
                    opts.push(this.iAnswer);
                } else {
                    var tempValue = opts[randPos];
                    opts[randPos] = this.iAnswer;
                    opts.push(tempValue);
                }
                return opts;
            },
            /**
             * TODO: move to the vm or a separate service
             * Set the player's answer in the view
             * @param opt {String || Number}
             */
            setPlayerAnswer : function(opt) {
                this.iPlayerAnswer = opt;
                this.sPlayerPrompt = "Your answer is: " + this.iPlayerAnswer;
            }
        };
    }
);