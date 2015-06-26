angular.module('CountingGameCtrl', [])

    .controller('CountingGameController', function($location, Answers, AllStars) {
        var vm = this;
        // TODO: add these proeprties to the first check (see if they have been initialised properly)
        vm.tagline = 'Select the correct answer to the given math problems.';

        // indicated is the user is currently playing the game
        vm.isPlaying = false;

        vm.startGame = function() {
            // consider moving this to the answer service
            var config = {
                questCount: 10,
                falseOptCount : 5,
                minDev : -20,
                maxDev : 20,
                minNum : 11,
                maxNum : 29
            };
            // TODO: rename all properties to have the type in front of them
            vm.questions = Answers.generateQuestions(config);
            vm.questions[0].isCurrentQuestion = true;
            vm.isPlaying = true;
            vm.startTime = new Date().getTime();
            vm.currentQuestionNo = 0;
        };
        // TODO: refactor and write unit tests
        vm.submitAnswer = function() {
            if(!vm.questions[vm.currentQuestionNo].playerAnswer) {
                vm.questions[vm.currentQuestionNo].playerPrompt = "Please select an answer!";
                return;
            }

            if ((vm.currentQuestionNo + 1) < vm.questions.length) {
                vm.questions[vm.currentQuestionNo++].isCurrentQuestion = false;
                vm.questions[vm.currentQuestionNo].isCurrentQuestion = true;
            } else {
                vm.gameFinished = true;
                vm.endGame();
            }
        };

        // TODO: write part separator here START (end game code)

        // TODO: write unit tests
        vm.endGame = function() {
            vm.gameResult = vm._getGameResult();

            var nTotalSeconds = vm._getTotalSeconds(vm.startTime);

            vm.gameTime = vm._getGameTime(nTotalSeconds);
        };
        // TODO: write unit tests
        vm._getGameResult = function() {
            var result = 0;

            for (var i = 0; i < vm.questions.length; i++) {
                if (vm.questions[i].playerAnswer === vm.questions[i].answer) {
                    result++;
                }
            }

            return result;
        };
        // TODO: write unit tests
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

        // TODO: write part separator here END (end game code)

        // TODO: refactor and write unit tests
        vm.allStarData = {
            game: 'count'
        };
        // TODO: refactor and write unit tests
        vm.createAllStar = function () {
            vm.allStarData.score = vm.gameResult;
            vm.allStarData.time = vm.totalSeconds;
            if(!$.isEmptyObject(vm.allStarData)) {
                AllStars.create(vm.allStarData)
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