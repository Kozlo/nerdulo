angular.module('CountingGameCtrl', [])

    .controller('CountingGameController', function($location, Answers, AllStars) {
        // TODO: for all method write JSDoc-style comments
        //===============================
        //  Properties and Variables
        //===============================

        var vm = this;
        // TODO: add these properties to the first check (see if they have been initialised properly)
        vm.sTagline = 'Select the correct answer to the given math problems.';
        // indicated is the user is currently playing the game
        vm.bIsPlaying = false;

        //===============================
        //  Start Game Functionality
        //===============================

        /**
         * Calls the method to generate questions and set all needed properties.
         *
         * @public
         */
        vm.startGame = function() {
            vm.aQuests = Answers.generateQuestions();
            vm.aQuests[0].bIsCurr = true;
            vm.bIsPlaying = true;
            vm.iStartTime = new Date().getTime();
            vm.iQuestNo = 0;
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
        vm.submitAnswer = function() {
            var oCurrQuest = vm.aQuests[vm.iQuestNo],
                bIsCurrQuestValid = vm._validateAnswer(oCurrQuest);

            if(bIsCurrQuestValid) {
                vm._processAnswer(oCurrQuest);
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
        vm._validateAnswer = function(oCurrQuest) {
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
        vm._processAnswer = function(oCurrQuest) {
            if (!oCurrQuest.bIsLast) {
                vm._switchToNextQuest(oCurrQuest);
            } else {
                vm.endGame();
            }
        };

        /**
         * Changes properties for current and next question.
         * Increases question count iterator.
         *
         * @private
         * @param {Object} oCurrQuest the question being inspected
         */
        vm._switchToNextQuest = function(oCurrQuest) {
            oCurrQuest.bIsCurr = false;
            vm.iQuestNo++;
            vm.aQuests[vm.iQuestNo].bIsCurr = true;
        };

        //===============================
        //  End Game Functionality
        //===============================

        /**
         * Calls the methods needed to end tha game.
         *
         * @public
         */
        vm.endGame = function() {
            vm.bGameFinished = true;

            vm.nGameScore = vm._getGameResult();

            vm.iTotalSeconds = vm._getTotalSeconds(vm.iStartTime);

            vm.sGameTime = vm._getGameTime(vm.iTotalSeconds);
        };

        /**
         * Calls the method to check each answer and returns the number of correct ones.
         *
         * @private
         * @returns {int} the number of correct answers
         */
        vm._getGameResult = function() {
            var nResult = 0;

            for (var i = 0; i < vm.aQuests.length; i++) {
                var bIsAnswerCorrect = vm._answerChecker(vm.aQuests[i].iPlayerAnswer, vm.aQuests[i].nAnswer);

                if (bIsAnswerCorrect) {
                    nResult++;
                }
            }

            return nResult;
        };

        /**
         * Compares the passed player answer and the correct answer.
         * And returns a respective indicator.
         *
         * @private
         * @param {int} iPlayerAnswer the answer the player has given
         * @param {int} nCorrectAnswer the correct answer to the question
         * @returns {bool} correctness indicator
         */
        vm._answerChecker = function(iPlayerAnswer, iCorrectAnswer) {
            return iPlayerAnswer === iCorrectAnswer;
        };

        /**
         * Calculates the total time spent based on start time and end time.
         *
         * @private
         * @param {Object} iStartTime start time
         * @returns {int} total seconds
         */
        vm._getTotalSeconds = function(iStartTime) {
            var nEndTime = new Date().getTime();

            return vm._calculateTotalSeconds(iStartTime, nEndTime);
        };

        /**
         * Calculates total seconds given start and end time.
         *
         * @private
         * @param {int} iStartTime start time
         * @param {int} iEndTime end time
         * @returns {int} total seconds
         */
        vm._calculateTotalSeconds = function(iStartTime, iEndTime) {
            return Math.floor((iEndTime - iStartTime) / 1000);
        };

        /**
         * Return a string with the time spend in game divided into minutes and seconds.
         *
         * @private
         * @param {int} iTotalSeconds total time in seconds
         * @returns {string} total game time
         */
        vm._getGameTime = function(iTotalSeconds) {
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

        // TODO: refactor and write unit tests
        vm.oAllStarData = {
            game: 'count'
        };
        // TODO: refactor and write unit tests
        vm.createAllStar = function () {
            vm.oAllStarData.score = vm.nGameScore;
            vm.oAllStarData.time = vm.iTotalSeconds;
            if(!$.isEmptyObject(vm.oAllStarData)) {
                AllStars.create(vm.oAllStarData)
                    .success(function() {
                        // when the data is updated, redirect the player to the score board
                        $location.path('/allstars');
                        $location.hash('counting-allstar');
                    });
            } else {
                console.log('AllStar data is empty');
            }
        };
    }
);