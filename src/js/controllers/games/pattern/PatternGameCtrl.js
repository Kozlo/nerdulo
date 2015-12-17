angular.module('PatternGameCtrl', [])

    .controller('PatternGameController', function($controller, Patterns) {
        //===============================
        //  Properties and Variables
        //===============================

        var vm = this;

        /**
         * @property {Object} oAllStarData data property used for saving score
         */
        vm.oAllStarData = {
            game: "pattern"
        };

        /**
         * @property {string} allStarTarget hash target for the app when the game is saved
         */
        vm.sAllStarTarget = "pattern-allstar";

        /**
         * @property {string} sTagline the text describing the game shown before the game starts
         */
        vm.sTagline  = "Choose the number that fits in the pattern.";

        // make sure this controller inherits from the base game controller
        angular.extend(this, $controller('GameController'));

        /**
         * Calls the base game controller start game and passed the questions.
         *
         * @public
         */
        vm.startGame = function() {
            var aQuests = Patterns.generateQuestions();

            vm._startGame(aQuests);
        };
    }
);