angular.module('CountingGameCtrl', [])

    .controller('CountingGameController', function($location, Answers, AllStars) {
        var vm = this;
        vm.tagline = 'Select the correct answer to the given math problems.';

        // indicated is the user is currently playing the game
        vm.isPlaying = false;

        vm.startGame = function() {
            // variables for question
            vm.questions = Answers.generateQuestions();
            vm.isPlaying = true;
            vm.startTime = new Date().getTime();
            vm.currentQuestionNo = 0;
            vm.questions[0].isCurrentQuestion = true;
        };
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
        vm.endGame = function() {
            var result = 0;
            for (var i = 0; i < vm.questions.length; i++) {
                if (vm.questions[i].playerAnswer === vm.questions[i].answer) {
                    result++;
                }
            }
            vm.gameResult = result;
            var endTime = new Date().getTime(),
                totalSeconds = Math.floor((endTime - vm.startTime) / 1000);

            vm.totalSeconds = totalSeconds;

            if (totalSeconds < 60) {
                vm.gameTime = totalSeconds + " seconds";
            } else {
                var gameMinutes = Math.floor(totalSeconds / 60),
                    gameSeconds = totalSeconds % 60;
                vm.gameTime = gameMinutes + " minutes";
                if (gameSeconds > 0) {
                    vm.gameTime += " and " + gameSeconds + " seconds";
                }
            }
        };

        vm.allStarData = {};

        vm.createAllStar = function () {
            vm.allStarData.score = vm.gameResult;
            vm.allStarData.time = vm.totalSeconds;
            console.log(vm.allStarData, vm.gameResult, vm.totalSeconds);
            if(!$.isEmptyObject(vm.allStarData)) {
                AllStars.create(vm.allStarData)
                    .success(function() {
                        // when the data is updated, redirect the player to the score board
                        $location.path('/allstars');
                    });
            } else {
                console.log('AllStar data is empty');
            }
        };
    }
);