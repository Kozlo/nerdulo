angular.module('AnswerService', [])

    .service('Answers', function() {
        /**
         * The constructor method for a question.
         *
         * @param {number} nQuestNo the number given for the question
         * @param {Object} oConfig values used to differentiate questions
         */
        function Question(nQuestNo, oConfig, bIsLast) {
            this.nQuestNo = nQuestNo;
            this.oConfig = {
                falseOptCount : oConfig.falseOptCount,
                deviance : {
                    min : oConfig.deviance.min,
                    max : oConfig.deviance.max
                }
            };
            this.oNumbers = {
                one : this.getRandomInt(oConfig.number.min, oConfig.number.max),
                two : this.getRandomInt(oConfig.number.min, oConfig.number.max)
            };
            this.nAnswer = this.calculator(this.oNumbers.one, this.oNumbers.two);
            this.aFalseOptions = this.optionGenerator();
            this.aOptions = this.addAnswer(this.aFalseOptions);
            this.bIsCurr = false;
            this.bIsLast = bIsLast;
            this.nPlayerAnswer = null;
            this.sPlayerPrompt = "Your answer is: ";
        }

        Question.prototype = {
            // TODO: move to a separate helper class
            /**
             * Returns a random integer between min (inclusive) and max (inclusive).
             * Using Math.round() will give you a non-uniform distribution!
             *
             * @public
             * @param {number} nMin the minimum number allowed
             * @param {number} nMax the maximum number allowed
             * @returns {number} a random integer
             */
            getRandomInt : function(nMin, nMax) {
                return Math.floor(Math.random() * (nMax - nMin + 1)) + nMin;
            },

            // TODO: move to a separate helper class
            /**
             * Calls getRandomInt until an non-zero value is returned.
             *
             * @public
             * @param {number} nMin the minimum number allowed
             * @param {number} nMax the maximum number allowed
             * @returns {number} a non-zero random integer
             */
            getNonZeroRandomInt : function(nMin, nMax) {
                var nRandDev;

                // keep calling getRandomInt until a non-zero number is returned
                do {
                    nRandDev = this.getRandomInt(nMin, nMax);
                } while (isNaN(nRandDev) || nRandDev === 0 );

                return nRandDev;
            },

            // TODO: move to a separate helper class (also add the operation)
            /**
             * Return the correct answer to the math problem.
             *
             * @public
             * @param {number} nOne the first number to calculate
             * @param {number} nTwo the second number to calculate
             * @returns {number} the multiplied result
             */
            calculator : function(nOne, nTwo) {
                return nOne * nTwo;
            },

            /**
             * Returns the specified amount of incorrect answers to the math problem.
             * Makes sure that the specified answer isn't equal to the answer and doesn't repeat.
             *
             * @public
             * @returns {Array} the multiplied result
             */
            optionGenerator : function() {
                var aOpts = [];

                while (aOpts.length < this.oConfig.falseOptCount) {
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
                var nRandOpt = this.getRandomOption();

                this.pushUniqueValueToArray(aOpts, nRandOpt);
            },

            // TODO: move to different helper class
            /**
             * Checks if the passed value already exists in the array and pushes it to it if not.
             *
             * @public
             * @param {Array} aValues an array of options
             * @param {string|number|bool|Object|Array} value the value to be pushed to the array
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
             * @returns {number} formatted result.
             */
            getRandomOption : function() {
                var oDev = this.oConfig.deviance,
                    nRandDev = this.getNonZeroRandomInt(oDev.min, oDev.max);

                return this.processRandomOption(this.nAnswer, nRandDev);
            },

            /**
             * Converts the passed deviation to a usable option given the answer.
             *
             * @public
             * @param {number} nAnswer the correct answer to the math problem
             * @param {number} nDeviation the generated random deviation
             * @returns {number} formatted result.
             */
            processRandomOption : function(nAnswer, nDeviation) {
                var nRandOpt = nAnswer * this.convertNumToMultiple(nDeviation);

                return Math.floor(nRandOpt);
            },

            // TODO: move to a helper class
            /**
             * Converts the passed number to a decimal equivalent and adds 1 (e.g. 10 is converted to 1.1).
             *
             * @public
             * @param {number} nNumber decimal digit to be converted
             * @returns {number} formatted result
             */
            convertNumToMultiple : function(nNumber) {
                return 1 + nNumber / 100;
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

                this.insertValueInArray(aOpts, nRandPos, this.nAnswer);
                
                return aOpts;
            },

                insertValueInArray : function(aArray, nIndex, value) {
                aArray.push(aArray[nIndex]);
                aArray[nIndex] = value;
            },

            /**
             * Set the player's answer in the view
             *
             * @param {string|number} nOpt
             */
            setPlayerAnswer : function(nOpt) {
                this.nPlayerAnswer = nOpt;
                this.sPlayerPrompt = "Your answer is: " + this.nPlayerAnswer;
            }
        };

        this.generateQuestions = function() {
            // TODO: do it so that there's only 1 config per answer batch as it's the same for all (e.g. have an onject that has a common config and an array of questions)
            var aQuests= [],
                oConfig = {
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

            for (var i=0 ; i < oConfig.questCount   ; i++) {
                var bIstLast = (i + 1) >= oConfig.questCount;

                aQuests.push( new Question(i, oConfig, bIstLast));
            }

            return aQuests;
        };
    }
);