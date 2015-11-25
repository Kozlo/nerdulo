(function() {
    'use strict';

    //===============================
    //  Module Initialization
    //===============================

    module("Pattern Service", {
        setup: function () {
            var injector = angular.injector(['ng', 'PatternGameCtrl', 'PatternService', 'AllStarService']);

            this.oPtrnSrv = injector.get('Patterns');
            // TODO: figure out if this is needed at all
            this.oAllstars = injector.get('AllStars');

            // TODO: use this when the setup is changed
            //this.oConfig = {
            //    startNum : {
            //        min : 9,
            //        max : 15
            //    },
            //    multiple : {
            //        min : 2,
            //        max : 3
            //    },
            //    constant : {
            //        min : -20,
            //        max : 20
            //    },
            //    itemCount : 5,
            //    optCount : 5,
            //    deviance : {
            //        min : -25,
            //        max : 25
            //    }
            //};

            this.aPatterns = this.oPtrnSrv.generatePatterns();
            // TODO: think of a better way to do this
            this.oPattern = this.aPatterns[0];
        },
        teardown: function () {
            // TODO: add functions to be run after the test is done
        }
    });

    //===============================
    //  General Tests
    //===============================

    test("Is the config for the answers as expected", function () {
        ok(true, "write tests here :)");
    });

}());