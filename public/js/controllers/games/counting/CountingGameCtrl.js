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
            vm.nStartTime = new Date().getTime();
            vm.nQuestNo = 0;
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
            var oCurrQuest = vm.aQuests[vm.nQuestNo],
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
            if(oCurrQuest.nPlayerAnswer) {
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
            vm.nQuestNo++;
            vm.aQuests[vm.nQuestNo].bIsCurr = true;
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

            vm.nTotalSeconds = vm._getTotalSeconds(vm.nStartTime);

            vm.sGameTime = vm._getGameTime(vm.nTotalSeconds);
        };

        /**
         * Calls the method to check each answer and returns the number of correct ones.
         *
         * @private
         * @returns {number} the number of correct answers
         */
        vm._getGameResult = function() {
            var nResult = 0;

            for (var i = 0; i < vm.aQuests.length; i++) {
                var bIsAnswerCorrect = vm._answerChecker(vm.aQuests[i].nPlayerAnswer, vm.aQuests[i].nAnswer);

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
         * @param {number} nPlayerAnswer the answer the player has given
         * @param {number} nCorrectAnswer the correct answer to the question
         * @returns {bool} correctness indicator
         */
        vm._answerChecker = function(nPlayerAnswer, nCorrectAnswer) {
            return nPlayerAnswer === nCorrectAnswer;
        };

        /**
         * Calculates the total time spent based on start time and end time.
         *
         * @private
         * @param {Object} oStartTime start time
         * @returns {number} total seconds
         */
        vm._getTotalSeconds = function(oStartTime) {
            var oEndTime = new Date().getTime();

            return vm._calculateTotalSeconds(oStartTime, oEndTime);
        };
        // TODO: write unit tests
        vm._calculateTotalSeconds = function(oStartTime, oEndTime) {
            return Math.floor((oEndTime - oStartTime) / 1000);
        };
        // TODO: write unit tests (and possibly refactor)
        vm._getGameTime = function(nTotalSeconds) {
            var sGameTime;

            if (nTotalSeconds < 60) {
                sGameTime = nTotalSeconds + " seconds";
            } else {
                var nGameMinutes = Math.floor(nTotalSeconds / 60),
                    nGameSeconds = nTotalSeconds % 60;
                sGameTime = nGameMinutes + " minutes";
                if (nGameSeconds > 0) {
                    sGameTime += " and " + nGameSeconds + " seconds";
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
            vm.oAllStarData.time = vm.nTotalSeconds;
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