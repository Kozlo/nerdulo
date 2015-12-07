// TODO: separate the controllers and services
angular.module('nerdulo', [
    'ngRoute',
    'appRoutes',
    'MainCtrl',
    'GameCtrl',
    'CountingGameCtrl',
    'PatternGameCtrl',
    'AnswerService',
    'PatternService',
    'AllStarCtrl',
    'AllStarService'
]);