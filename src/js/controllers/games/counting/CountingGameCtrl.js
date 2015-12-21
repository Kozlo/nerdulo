angular.module('CountingGameCtrl', [])

    .controller('CountingGameController', function($controller, Answers) {
        //===============================
        //  Properties and Variables
        //===============================

        var vm = this;

        /**
         * @property {Object} oAllStarData data property used for saving score
         */
        vm.oAllStarData = {
            game: "count"
        };

        /**
         * @property {string} allStarTarget hash target for the app when the game is saved
         */
        vm.sAllStarTarget = "counting-allstar";

        /**
         * @property {string} sGameName the text describing the game shown before the game starts
         */
        vm.sGameName  = "The Counting Game";

        /**
         * @property {string} sTagline the text describing the game shown before the game starts
         */
        vm.sTagline  = "Select the correct answer to the given math problems.";

        // make sure this controller inherits from the base game controller
        angular.extend(this, $controller('GameController'));

        /**
         * Calls the base game controller start game and passed the questions.
         *
         * @public
         */
        vm.startGame = function() {
            var aQuests = Answers.generateQuestions();

            vm._startGame(aQuests);
        };
    }
);