angular.module('AllStarCtrl', [])

    .controller('AllStarController', function($scope, AllStars) {
        $scope.allStarData = {};

        $scope.tagline = 'The hall of fame!';

        AllStars.get('/api/allstars')
            .success(function(data){
                $scope.allStars = data;
            });

        // TODO: move the create data to end of the game
        $scope.createAllStar = function () {
            if(!$.isEmptyObject($scope.allStarData)) {
                AllStars.create($scope.allStarData)
                    .success(function(data) {
                        console.log('allstar saved successfully');
                        $scope.allStarData = {}; // clear the form after the new Nerd is created
                        $scope.allStars = data;
                    });
            } else {
                console.log('AllStar data is empty');
            }
        };

        $scope.deleteAllStar = function(id) {
            AllStars.delete(id)
                .success(function(data) {
                    $scope.allStars = data;
                })
        };
    }
);