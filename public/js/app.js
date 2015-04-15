// TODO: seaprate the controllers and services in separately
angular.module('nerdulo', [
    'ngRoute',
    'appRoutes',
    'MainCtrl',
    'NerdCtrl',
    'NerdService',
    'CountingGameCtrl',
    'PatternGameCtrl',
    'AnswerService',
    'PatternService',
    'AllStarCtrl',
    'AllStarService'
]);