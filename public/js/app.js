// TODO: seaprate the controllers and services in separately
angular.module('nerdulo', [
    'ngRoute',
    'appRoutes',
    'MainCtrl',
    'CountingGameCtrl',
    'PatternGameCtrl',
    'AnswerService',
    'PatternService',
    'AllStarCtrl',
    'AllStarService'
]);