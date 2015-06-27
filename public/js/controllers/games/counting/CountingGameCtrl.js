angular.module('CountingGameCtrl', [])

    .controller('CountingGameController', function($location, Answers, AllStars) {
        // TODO: for all method write JSDoc-style comments
        //===============================
        //  Properties and Variables
        //===============================

        var vm = this;
        // TODO: add these proeprties to the first check (see if they have been initialised properly)
        vm.sTagline = 'Select the correct answer to the given math problems.';
        // indicated is the user is currently playing the game
        vm.bIsPlaying = false;

        //===============================
        //  Start Game Functionality
        //===============================

        vm.startGame = function() {
            // consider moving this to the answer service
            // TODO: put both dev and num in a property with 'min' and 'max'
            var oConfig = {
                questCount: 10,
                falseOptCount : 5,
                minDev : -20,
                maxDev : 20,
                minNum : 11,
                maxNum : 29
            };

            vm.aQuests = Answers.generateQuestions(oConfig);
            vm.aQuests[0].isCurr = true;
            vm.bIsPlaying = true;
            vm.nStartTime = new Date().getTime();
            vm.nQuestNo = 0;
        };

        //===============================
        //  Submit Answer Functionality
        //===============================

        // TODO: refactor and write unit tests
        vm.submitAnswer = function() {
            if(!vm.aQuests[vm.nQuestNo].nPlayerAnswer) {
                vm.aQuests[vm.nQuestNo].sPlayerPrompt = "Please select an answer!";
                return;
            }

            // TODO: refactor maybe
            if ((vm.nQuestNo + 1) < vm.aQuests.length) {
                vm.aQuests[vm.nQuestNo++].isCurr = false;
                vm.aQuests[vm.nQuestNo].isCurr = true;
            } else {
                vm.bGameFinished = true;
                vm.endGame();
            }
        };

        //===============================
        //  End Game Functionality
        //===============================

        // TODO: write unit tests
        vm.endGame = function() {
            // TODO: in the test also check if the properties have been set...
            vm.nGameScore = vm._getGameResult();

            vm.nTotalSeconds = vm._getTotalSeconds(vm.nStartTime);

            vm.sGameTime = vm._getGameTime(vm.nTotalSeconds);
        };
        // TODO: write unit tests
        vm._getGameResult = function() {
            var nResult = 0;

            for (var i = 0; i < vm.aQuests.length; i++) {
                // TODO: move this out to a different method and make sure the correct property is used
                if (vm.aQuests[i].nPlayerAnswer === vm.aQuests[i].nAnswer) {
                    nResult++;
                }
            }

            return nResult;
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