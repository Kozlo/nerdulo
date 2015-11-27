angular.module('PatternService', [])

    .service('Patterns', function() {

        // TODO: sort these according to difficulty
        /**
         * Configuration used for generating patterns.
         *
         * @public
         */
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

        /**
         * Construct and return the specified number of patterns
         *
         * @public
         * @returns {Array} patterns
         */
        this.generatePatterns = function() {
            var aPatterns = [];

            for (var i = 0 ; i < this.oConfig.patternCount; i++) {
                var oPattern = new Pattern(i, this.oConfig);

                aPatterns.push(oPattern);
            }

            return aPatterns;
        };

        // TODO: figure out how to unit test this properly
        /**
         * Constructor method for the Pattern class
         *
         * @public
         * @param {int} qNo the number of the current pattern
         * @param {Object} oConfig configuration
         * @returns {int} a random integer
         */
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
            this.oOptions = this._optionGenerator(oConfig.optCount - 1);
            this.iPlayerAnswer = null;
            this.bIsCurrentQuestion = false;
            this.sPlayerPrompt = "Your answer is: ";
        }
        //
        Pattern.prototype = {
            // TODO: move to a separate helper class
            /**
             * Returns a random integer between min (inclusive) and max (inclusive).
             * Using Math.round() will give you a non-uniform distribution!
             *
             * @private
             * @param {int} iMin the minimum number allowed
             * @param {int} iMax the maximum number allowed
             * @returns {int} a random integer
             */
            _getRandomInt : function(iMin, iMax) {
                return Math.floor(Math.random() * (iMax - iMin + 1)) + iMin;
            },

            /**
             * Generates an array with numbers following a pattern
             *
             * @private
             * @returns {Array} aPattern
             */
            _patternGenerator : function() {
                // initialize the pattern item array with the starting number as the first item
                var aPattern = [];

                aPattern.push(this.oConfig.startNum);

                // generate item count - 1 as the first one is already set
                for (var i=0; i < this.oConfig.itemCount - 1; i++) {
                    aPattern.push(aPattern[i] * this.oConfig.multiple + this.oConfig.constant);
                }

                return aPattern;
            },

            /**
             * Hides a random option from the pattern (except for the first one as it's a single digit number).
             *
             * @private
             * @returns {int} the correct answer
             */
            _hideOption : function() {
                // pass 1 as the first argument to make sure the hidden field is not the first one (i.e. index 0)
                var iHiddenOptNo = this._getRandomInt(1, this.oConfig.itemCount - 1),
                    iAnswer = this.aPattern[iHiddenOptNo];

                this.aPattern[iHiddenOptNo] = "?";

                return iAnswer;
            },

            /**
             * Generates the specified amount of incorrect answers to the math problem.
             * Makes sure that the specified answer isn't equal to the answer
             *
             * @returns {Array} incorrect options to choose from
             */
            _optionGenerator : function(iRequiredOptionCount) {
                // an array to hold all answers
                var aOpts = [];

                do {
                    var iRandOpt = this._getRandomOption(this.iAnswer);

                    // check if the option already is in the list
                    if (aOpts.indexOf(iRandOpt) < 0 && iRandOpt !== 0) {
                        //push the non-zero option to the list of available options
                        aOpts.push(iRandOpt);
                    }
                } while (aOpts.length < iRequiredOptionCount);

                // return the options, but add the correct answer to the list first
                return this._addAnswer(aOpts);
            },

            // TODO: write unit test and add JSDoc
            _getRandomOption: function(iAnswer) {
                // TODO: optimize this method
                // TODO: replace the reference to config with arguments passed to the method
                var iRandOpt;

                if (iAnswer > 30) {
                    // generate a random number that is different from the correct answer by max % specified by the maxDev variable
                    var iRandDev = this._getRandomInt(this.oConfig.deviance.min, this.oConfig.deviance.max);

                    iRandOpt = Math.floor(iAnswer * (1 + iRandDev / 100));
                } else {
                    iRandOpt = this._getRandomInt(-this.oConfig.optCount, this.oConfig.optCount);
                }

                return iRandOpt;
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