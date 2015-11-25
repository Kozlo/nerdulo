(function() {
    'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Pattern Game", {
        setup: function () {
            var injector = angular.injector(['ng', 'PatternGameCtrl', 'PatternService', 'AllStarService']);

            this.ptrnSrv = injector.get('Patterns');
            this.allstars = injector.get('AllStars');
            // TODO: figure out how to include the actually $location service
            this.mockLocation = {location: {href: ""}};

            var $controller = injector.get('$controller');

            this.oCtrl = $controller('PatternGameController', {
                $location: this.mockLocation,
                Patterns: this.ptrnSrv,
                AllStars: this.allstars
            });

            // make sure the game is started as it's needed for proper tests
            this.oCtrl.startGame();
        },
        teardown: function () {

        }
    });

    //===============================
    //  General Tests
    //===============================

    test("Test to see if the controller exists and the correct route is used", function () {
        ok(this.oCtrl, 'The Pattern Game controller exists');
        // TODO: check what instanceof should be used
        //ok(this.oCtrl instanceof, "The controller is an instance of...");
    });

    //===============================
    //  Start Game Tests
    //===============================

}());