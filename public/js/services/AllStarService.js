angular.module('AllStarService', [])

    .factory('AllStars', ['$http', function($http) {

        return {
            get : function() {
                return $http.get('/api/allstars');
            },

            // call to POST and create a new nerd
            create : function(allStarData) {
                return $http.post('/api/allstars', allStarData);
            },

            // call to DELETE a nerd
            delete : function(id) {
                return $http.delete('/api/allstars/' + id);
            }
        }

    }]);