angular.module('PatternGameCtrl', [])

    .controller('PatternGameController', function($location, Patterns, AllStars) {
        //===============================
        //  Properties and Variables
        //===============================

        var vm = this;

        vm.tagline = 'Choose the number that fits in the pattern.';
        // indicates if the user is currently playing the game
        vm.isPlaying = false;

        //===============================
        //  Start Game Functionality
        //===============================

        // TODO: check if some things could be re-used from counting game and consider adding to a separate service
        vm.startGame = function() {
            vm.aQuests = Patterns.generatePatterns();
            vm.aQuests[0].bIsCurr = true;
            vm.bIsPlaying = true;
            vm.iStartTime = new Date().getTime();
            vm.iQuestNo = 0;
        };

        //===============================
        //  Submit Answer Functionality
        //===============================

        // TODO: check if some things could be re-used from counting game and consider adding to a separate service
        vm.submitAnswer = function() {
            if(!vm.aQuests[vm.iQuestNo].iPlayerAnswer) {
                vm.aQuests[vm.iQuestNo].sPlayerPrompt = "Please select an answer!";
                return;
            }

            if ((vm.iQuestNo + 1) < vm.aQuests.length) {
                vm.aQuests[vm.iQuestNo++].bIsCurr = false;
                vm.aQuests[vm.iQuestNo].bIsCurr = true;
            } else {
                vm.gameFinished = true;
                vm.endGame();
            }
        };

        //===============================
        //  End Game Functionality
        //===============================

        // TODO: check if some things could be re-used from counting game and consider adding to a separate service
        vm.endGame = function() {
            var result = 0;
            for (var i = 0; i < vm.aQuests.length; i++) {
                if (vm.aQuests[i].iPlayerAnswer === vm.aQuests[i].iAnswer) {
                    result++;
                }
            }
            vm.gameResult = result;
            var endTime = new Date().getTime(),
                totalSeconds = Math.floor((endTime - vm.iStartTime) / 1000);

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

        //===============================
        //  Submit Results Functionality
        //===============================

        // TODO: create re-usable code that would be used for both pattern game and counting game
        vm.allStarData = {
            game: 'pattern'
        };

        vm.createAllStar = function () {
            vm.allStarData.score = vm.gameResult;
            vm.allStarData.time = vm.totalSeconds;
            if(!$.isEmptyObject(vm.allStarData)) {
                AllStars.create(vm.allStarData)
                    .success(function() {
                        // when the data is updated, redirect the player to the score board
                        $location.path('/allstars');
                        $location.hash('pattern-allstar');
                    });
            } else {
                console.log('AllStar data is empty');
            }
        };
    }
);