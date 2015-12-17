angular.module('AnswerService', [])

    .service('Answers', function() {

        this.oConfig = {
            questCount: 10,
            optCount : 5,
            deviance : {
                min : -25,
                max : 25
            },
            number : {
                min : 11,
                max : 29
            }
        };


        /**
         * Generates and returns questions for the counting game.
         *
         * @public
         * @returns {Array} generated questions
         */
        this.generateQuestions = function() {
            var aQuests= [];

            for (var i = 0 ; i < this.oConfig.questCount ; i++) {
                var bIsLast = this._getIsLast(i, this.oConfig.questCount),
                    oQuestion = this._getNewQuestion(i, this.oConfig, bIsLast);

                aQuests.push(oQuestion);
            }

            return aQuests;
        };

        /**
         * The constructor method for a question.
         *
         * @private
         * @param {int} iIndex the number of the question
         * @param {Object} oConfig the question's config
         * @param {boolean} bIsLast indicator for if the questions is the last one
         * @returns {Object} generated question
         */
        this._getNewQuestion = function(iIndex, oConfig, bIsLast) {
            return new Question(iIndex, oConfig, bIsLast);
        };

        /**
         * Calculates if the current question is the last one.
         *
         * @private
         * @param {int} iIndex the number of the question
         * @param {int} iQuestCount total number of available questions
         * @returns {boolean} indicator for whether the given question is the last one
         */
        this._getIsLast = function(iIndex, iQuestCount) {
            return (iIndex + 1) >= iQuestCount;
        };

        /**
         * The constructor method for a question.
         *
         * @public
         * @param {int} iQuestNo the number given for the question
         * @param {Object} oConfig values used to differentiate questions
         * @param {boolean} bIsLast is the given question last
         */
        function Question(iQuestNo, oConfig, bIsLast) {
            this.iQuestNo = iQuestNo;
            this.oConfig = {
                optCount : oConfig.optCount,
                deviance : {
                    min : oConfig.deviance.min,
                    max : oConfig.deviance.max
                }
            };
            this.oNumbers = {
                one : this.getRandomInt(oConfig.number.min, oConfig.number.max),
                two : this.getRandomInt(oConfig.number.min, oConfig.number.max)
            };
            this.iAnswer = this.calculator(this.oNumbers.one, this.oNumbers.two);
            this.aFalseOptions = this.optionGenerator();
            this.aOptions = this.addAnswer(this.aFalseOptions);
            this.bIsCurr = false;
            this.bIsLast = bIsLast;
            this.iPlayerAnswer = null;
            this.sPlayerPrompt = "Your answer is: ";
        }

        Question.prototype = {
            // TODO: move to a separate helper class
            /**
             * Returns a random integer between min (inclusive) and max (inclusive).
             * Using Math.round() will give you a non-uniform distribution!
             *
             * @public
             * @param {int} iMin the minimum number allowed
             * @param {int} iMax the maximum number allowed
             * @returns {int} a random integer
             */
            getRandomInt : function(iMin, iMax) {
                return Math.floor(Math.random() * (iMax - iMin + 1)) + iMin;
            },

            // TODO: move to a separate helper class
            /**
             * Calls getRandomInt until an non-zero value is returned.
             *
             * @public
             * @param {int} iMin the minimum number allowed
             * @param {int} iMax the maximum number allowed
             * @returns {int} a non-zero random integer
             */
            getNonZeroRandomInt : function(iMin, iMax) {
                var iRandDev;

                // keep calling getRandomInt until a non-zero number is returned
                do {
                    iRandDev = this.getRandomInt(iMin, iMax);
                } while (isNaN(iRandDev) || iRandDev === 0 );

                return iRandDev;
            },

            // TODO: move to a separate helper class (also add the operation)
            /**
             * Return the correct answer to the math problem.
             *
             * @public
             * @param {int} iOne the first number to calculate
             * @param {int} iTwo the second number to calculate
             * @returns {int} the multiplied result
             */
            calculator : function(iOne, iTwo) {
                return iOne * iTwo;
            },

            /**
             * Returns the specified amount of incorrect answers to the math problem.
             * Makes sure that the specified answer isn't equal to the answer and doesn't repeat.
             *
             * @public
             * @returns {Array} the multiplied result
             */
            optionGenerator : function() {
                var aOpts = [],
                    iFalseOptCount = this.oConfig.optCount - 1;

                while (aOpts.length < iFalseOptCount) {
                    this.createOption(aOpts);
                }

                return aOpts;
            },

            /**
             * Calls the method for getting a random options and attempts to add it to the option array if it doesn't exist yet.
             *
             * @public
             * @param {Array} aOpts an array of options
             */
            createOption : function(aOpts) {
                var iRandOpt = this.getRandomOption();

                this.pushUniqueValueToArray(aOpts, iRandOpt);
            },

            // TODO: move to different helper class
            /**
             * Checks if the passed value already exists in the array and pushes it to it if not.
             *
             * @public
             * @param {Array} aValues an array of options
             * @param {string|int|bool|Object|Array} value the value to be pushed to the array
             */
            pushUniqueValueToArray : function(aValues, value) {
                if (aValues.indexOf(value) < 0) {
                    aValues.push(value);
                }
            },

            /**
             * Calls the methods for creating a random integer and returns the formatted result.
             *
             * @public
             * @returns {int} formatted result.
             */
            getRandomOption : function() {
                var oDev = this.oConfig.deviance,
                    iRandDev = this.getNonZeroRandomInt(oDev.min, oDev.max);

                return this.processRandomOption(this.iAnswer, iRandDev);
            },

            /**
             * Converts the passed deviation to a usable option given the answer.
             *
             * @public
             * @param {int} iAnswer the correct answer to the math problem
             * @param {int} nDeviation the generated random deviation
             * @returns {int} formatted result.
             */
            processRandomOption : function(iAnswer, iDeviation) {
                var iRandOpt = iAnswer * this.convertNumToMultiple(iDeviation);

                return Math.floor(iRandOpt);
            },

            // TODO: move to a helper class
            /**
             * Converts the passed number to a decimal equivalent and adds 1 (e.g. 10 is converted to 1.1).
             *
             * @public
             * @param {int} iNumber decimal digit to be converted
             * @returns {int} formatted result
             */
            convertNumToMultiple : function(iNumber) {
                return 1 + iNumber / 100;
            },

            /**
             * Adds the correct answer at a random position in the list of false options.
             *
             * @param {Array} aFalseOpts an array of false options
             * @returns {Array} new array of the answer inserted into the false option array
             */
            addAnswer : function(aFalseOpts) {
                var aOpts = aFalseOpts.slice(),
                    nRandPos = this.getRandomInt(0, aFalseOpts.length - 1);

                this.insertValueInArray(aOpts, nRandPos, this.iAnswer);
                
                return aOpts;
            },

            // TODO: write unit test and add JSDoc
            insertValueInArray : function(aArray, nIndex, value) {
                aArray.push(aArray[nIndex]);
                aArray[nIndex] = value;
            },

            /**
             * Set the player's answer in the view
             *
             * @param {string|int} opt
             */
            setPlayerAnswer : function(opt) {
                this.iPlayerAnswer = opt;
                this.sPlayerPrompt = "Your answer is: " + this.iPlayerAnswer;
            }
        };
    }
);