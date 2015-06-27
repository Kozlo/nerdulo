angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        // counting game view
        .when('/counting-game', {
            templateUrl: 'views/games/counting/countingGame.html'
        })
        // pattern game view
        .when('/pattern-game', {
            templateUrl: 'views/games/pattern/patternGame.html'
        })
        // scoreboard for all games
        .when('/allstars', {
            templateUrl: 'views/allstars.html',
            controller: 'AllStarController'
        })
        // view with the team members
        .when('/team', {
            templateUrl: 'views/team.html'
        });

    $locationProvider.html5Mode(true);

}]);