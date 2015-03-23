angular.module('NerdCtrl', [])

    .controller('NerdController', function($scope, Nerds) {
        $scope.nerdData = {};

        $scope.tagline = 'Nothing beats a pocket protector!';

        Nerds.get('/api/nerds')
            .success(function(data){
                $scope.nerds = data;
            });

        $scope.createNerd = function () {
            // make sure that the form isn't empty
            if(!$.isEmptyObject($scope.nerdData)) {
                Nerds.create($scope.nerdData)
                    .success(function(data) {
                        console.log('nerd saved successfully');
                        $scope.nerdData = {}; // clear the form after the new Nerd is created
                        $scope.nerds = data;
                    });
            } else {
                console.log('Nerd data is empty');
            }
        };

        $scope.deleteNerd = function(id) {
            Nerds.delete(id)
                .success(function(data) {
                    $scope.nerds = data;
                })
        };

    }
);