// TODO: separate the controllers and services
angular.module('nerdulo', [
    'ngRoute',
    'appRoutes',
    'MainCtrl',
    'GameCtrl',
    'CountingGameCtrl',
    'PatternGameCtrl',
    'GameService',
    'AnswerService',
    'PatternService',
    'AllStarCtrl',
    'AllStarService'
]);