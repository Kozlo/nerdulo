angular.module('GameCtrl', [])

    .controller('GameController', function($location, AllStars) {
        //===============================
        //  Properties and Variables
        //===============================

        /**
         * @property {boolean} indicates is the user is currently playing the game
         */
        this.bIsPlaying = false;

        //===============================
        //  Start Game Functionality
        //===============================

        /**
         * Calls the method to generate questions and set all needed properties.
         *
         * @public
         * @param {Array} aQuestions questions for the game
         */
        this._startGame = function(aQuestions) {
            this.aQuests = aQuestions;
            this.aQuests[0].bIsCurr = true;
            this.bIsPlaying = true;
            this.iStartTime = new Date().getTime();
            this.iQuestNo = 0;
        };

        //===============================
        //  Submit Answer Functionality
        //===============================

        /**
         * Calls the method to check if the user has selected a valid answer.
         * If yes, calls the method to proceed to the next question.
         *
         * @public
         */
        this.submitAnswer = function() {
            var oCurrQuest = this.aQuests[this.iQuestNo],
                bIsCurrQuestValid = this._validateAnswer(oCurrQuest);

            if(bIsCurrQuestValid) {
                this._processAnswer(oCurrQuest);
            }
        };

        /**
         * Checks is an answer is selected, returns the indicator.
         * Sets the player prompt if the answer hasn't been selected.
         *
         * @private
         * @param {Object} oCurrQuest the question being inspected
         * @returns {bool} indicator for whether the player prompt has been set.
         */
        this._validateAnswer = function(oCurrQuest) {
            if(oCurrQuest.iPlayerAnswer) {
                return true;
            } else {
                // TODO: remove 'magic' value
                oCurrQuest.sPlayerPrompt = "Please select an answer!";
                return false;
            }
        };

        /**
         * Checks if the question is not the last one.
         * If yes, then calls the method to switch to the new one.
         * If no, calls the method to end the game.
         *
         * @private
         * @param {Object} oCurrQuest the question being inspected
         */
        this._processAnswer = function(oCurrQuest) {
            if (!oCurrQuest.bIsLast) {
                this._switchToNextQuest(oCurrQuest);
            } else {
                this.endGame();
            }
        };

        /**
         * Changes properties for current and next question.
         * Increases question count iterator.
         *
         * @private
         * @param {Object} oCurrQuest the question being inspected
         */
        this._switchToNextQuest = function(oCurrQuest) {
            oCurrQuest.bIsCurr = false;
            this.iQuestNo++;
            this.aQuests[this.iQuestNo].bIsCurr = true;
        };

        //===============================
        //  End Game Functionality
        //===============================

        /**
         * Calls the methods needed to end tha game.
         *
         * @public
         */
        this.endGame = function() {
            this.bGameFinished = true;

            this.iGameScore = this._getGameResult();

            this.iTotalSeconds = this._getTotalSeconds(this.iStartTime);

            this.sGameTime = this._getGameTime(this.iTotalSeconds);
        };

        /**
         * Calls the method to check each answer and returns the number of correct ones.
         *
         * @private
         * @returns {int} the number of correct answers
         */
        this._getGameResult = function() {
            var iResult = 0;

            for (var i = 0; i < this.aQuests.length; i++) {
                var bIsAnswerCorrect = this._answerChecker(this.aQuests[i].iPlayerAnswer, this.aQuests[i].iAnswer);

                if (bIsAnswerCorrect) {
                    iResult++;
                }
            }

            return iResult;
        };

        /**
         * Compares the passed player answer and the correct answer.
         * And returns a respective indicator.
         *
         * @private
         * @param {int} iPlayerAnswer the answer the player has given
         * @param {int} iCorrectAnswer the correct answer to the question
         * @returns {bool} correctness indicator
         */
        this._answerChecker = function(iPlayerAnswer, iCorrectAnswer) {
            return iPlayerAnswer === iCorrectAnswer;
        };

        /**
         * Calculates the total time spent based on start time and end time.
         *
         * @private
         * @param {Object} iStartTime start time
         * @returns {int} total seconds
         */
        this._getTotalSeconds = function(iStartTime) {
            var nEndTime = new Date().getTime();

            return this._calculateTotalSeconds(iStartTime, nEndTime);
        };

        /**
         * Calculates total seconds given start and end time.
         *
         * @private
         * @param {int} iStartTime start time
         * @param {int} iEndTime end time
         * @returns {int} total seconds
         */
        this._calculateTotalSeconds = function(iStartTime, iEndTime) {
            return Math.floor((iEndTime - iStartTime) / 1000);
        };

        /**
         * Return a string with the time spend in game divided into minutes and seconds.
         *
         * @private
         * @param {int} iTotalSeconds total time in seconds
         * @returns {string} total game time
         */
        this._getGameTime = function(iTotalSeconds) {
            var sGameTime;

            if (iTotalSeconds < 60) {
                sGameTime = iTotalSeconds + " seconds";
            } else {
                var iGameMinutes = Math.floor(iTotalSeconds / 60),
                    iGameSeconds = iTotalSeconds % 60;

                sGameTime = iGameMinutes + " minutes";

                if (iGameSeconds > 0) {
                    sGameTime += " and " + iGameSeconds + " seconds";
                }
            }

            return sGameTime;
        };

        //===============================
        //  Submit Results Functionality
        //===============================

        /**
         * Creates an entry for the score the user got.
         *
         * @public
         */
        this.createAllStar = function () {
            var oData = this.oAllStarData;

            oData.score = this.iGameScore;
            oData.time = this.iTotalSeconds;

            if(!$.isEmptyObject(oData)) {
                this._createAllStar(oData);
            } else {
                console.log('AllStar data is empty');
            }
        };

        /**
         * Calls the all star promise create.
         *
         * @private
         */
        // TODO: change JSDoc and configure
        this._createAllStar = function (oAllStarData) {
            var sTarget = this.sAllStarTarget;

            AllStars.create(oAllStarData)
                .success(function() {
                    // when the data is updated, redirect the player to the score board
                    $location.path('/allstars');
                    $location.hash(sTarget);
                });
        };
    }
);