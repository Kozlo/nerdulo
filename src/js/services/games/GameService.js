angular.module('GameService', [])

    .service('Games', function() {

        /**
         * Configuration used for generating questions.
         *
         * @public
         */
        this.oConfig = {
            questCount: 10,
            optCount : 5,
            deviance : {
                min : -20,
                max : 20
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
         * This method should be re-implemented by each respective service.
         *
         * @private
         * @param {int} iIndex the number of the question
         * @param {Object} oConfig the question's config
         * @param {boolean} bIsLast indicator for if the questions is the last one
         * @returns {Object} generated question
         */
        this._getNewQuestion = function(iIndex, oConfig, bIsLast) {
            return {};
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
    }
);