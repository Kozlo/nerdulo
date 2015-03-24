angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        // counting game view
        .when('/counting-game', {
            templateUrl: 'views/counting-game.html'
        })
        // nerds page that will use the NerdController
        .when('/nerds', {
            templateUrl: 'views/nerd.html',
            controller: 'NerdController'
        })
        .when('/allstars', {
            templateUrl: 'views/allstars.html',
            controller: 'AllStarController'
        })
        .when('/team', {
            templateUrl: 'views/team.html'
        });

    $locationProvider.html5Mode(true);

}]);