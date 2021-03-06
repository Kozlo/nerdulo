angular.module('PatternService', [])

    .service('Patterns', function(Games) {
        // make sure this service inherits from the base game service
        angular.extend(this, Games);

        this.oConfig.startNum = {
            min : 9,
            max : 15
        };

        this.oConfig.multiple = {
            min : 2,
            max : 3
        };

        this.oConfig.constant = {
            min : -20,
            max : 20
        };

        this.oConfig.itemCount = 5;

        /**
         * The constructor method for a question.
         *
         * @private
         * @param {int} iIndex the number of the pattern
         * @param {Object} oConfig the question's config
         * @param {boolean} bIsLast indicator for if the pattern is the last one
         * @returns {Object} generated pattern
         */
        this._getNewQuestion = function(iIndex, oConfig, bIsLast) {
            return new Pattern(iIndex, oConfig, bIsLast);
        };

        /**
         * Constructor method for the Pattern class
         *
         * @public
         * @param {int} qNo the number of the current pattern
         * @param {Object} oConfig configuration
         * @param {boolean} bIsLast is this pattern the last one
         * @returns {int} a random integer
         */
        function Pattern(qNo, oConfig, bIsLast) {
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
            this.iOptionValueNorm = 30;
            this.aPattern = this._patternGenerator();
            // the answer is omitted and replaced with options
            this.iAnswer = this._hideOption();
            this.aOptions = this._optionGenerator(oConfig.optCount - 1);
            this.iPlayerAnswer = null;
            this.bIsCurr = false;
            this.bIsLast = bIsLast;
            this.sPlayerPrompt = "Your answer is: ";
        }

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
             * @private
             * @param {int} iRequiredOptionCount how many options should be created
             * @returns {Array} incorrect options to choose from with answer added
             */
            _optionGenerator : function(iRequiredOptionCount) {
                // an array to hold all answers
                // also, the absolute value of answer should not surpass the specified limit
                // if it does, then options should be calculated differently otherwise an infinite loop is possible
                var aOptions = [],
                    iAbsAnswer = Math.abs(this.iAnswer);

                do {
                    var iRandOpt = this._getRandomOption(iAbsAnswer, this.iOptionValueNorm);

                    this._addOptionToArray(iRandOpt, aOptions);
                } while (aOptions.length < iRequiredOptionCount);

                // call the method to add the correct answer to the list first
                this._addAnswer(this.iAnswer, this.oConfig.optCount - 1, aOptions);

                return aOptions;
            },

            /**
             * Generates a random integer based on how
             *
             * @private
             * @param {int} iAnswer how many options should be created
             * @param {int} iNorm at which point should lower value be considered
             * @returns {Array} incorrect options to choose from with answer added
             */
            _getRandomOption: function(iAnswer, iNorm) {
                var iRandomOption;

                // also, the absolute value of answer should not surpass the specified limit
                // if it does, then options should be calculated differently otherwise an infinite loop is possible
                if (iAnswer > iNorm) {
                    // generate a random number that is different from the correct answer by max % specified by the maxDev variable
                    var iRandDev = this._getRandomInt(this.oConfig.deviance.min, this.oConfig.deviance.max);

                    iRandomOption = this._convertDevToOption(iRandDev);
                } else {
                    iRandomOption =  this._getRandomInt(-iNorm, iNorm);
                }

                return iRandomOption;
            },

            /**
             * Generates an option based on the deviation passed and the current option's answer.
             *
             * The result should be an integer larger/smaller by the percentage passed.
             *
             * @private
             * @param {int} iRandDev deviation from the correct answer
             * @returns {int} incorrect answer
             */
            _convertDevToOption: function(iRandDev) {
                return Math.floor(this.iAnswer * (1 + iRandDev / 100));
            },

            /**
             * Checks if the passed value is already in the array and is 0. If not, then adds to the specified array.
             *
             * @private
             * @param {int} iRandOpt option to add to array
             * @param {Array} aOpts array of patterns
             */
            _addOptionToArray: function(iRandOpt, aOpts) {
                // check if the option already is in the list
                if (iRandOpt !== this.iAnswer && aOpts.indexOf(iRandOpt) === -1 && iRandOpt !== 0) {
                    //push the non-zero option to the list of available options
                    aOpts.push(iRandOpt);
                }
            },

            /**
             * Adds the specified answer to array.
             *
             * @private
             * @param {int} iAnswer answer to the question
             * @param {int} iOptLastIndex index of the last option
             * @param {Array} aOpts array of patterns
             */
            _addAnswer : function(iAnswer, iOptLastIndex, aOpts) {
                var iRandPos = this._getRandomInt(0, iOptLastIndex);

                aOpts.splice(iRandPos, 0, iAnswer);
            },

            /**
             * TODO: move to the vm or a separate service
             * Set the player's answer in the view
             * @param iOpt {String || Number}
             */
            setPlayerAnswer : function(iOpt) {
                this.iPlayerAnswer = iOpt;
                this.sPlayerPrompt = "Your answer is: " + this.iPlayerAnswer;
            }
        };
    }
);