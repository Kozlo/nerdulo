angular.module('AllStarCtrl', [])

    .controller('AllStarController', function($scope, $location, AllStars) {
        var vm = this;
        vm.showCounting = true;

        $scope.$on("$routeChangeSuccess", function () {
            // TODO: improve the logic here
            if ($location.hash() == 'counting-allstar') {
                vm.showCounting = true;
            } else {
                vm.showCounting = false;
            }
        });

        vm.allStarData = {};

        vm.tagline = 'The hall of fame!';

        AllStars.get('/api/allstars')
            .success(function(data){
                vm.allStars = data;
            });

        // TODO: move the create data to end of the game
        vm.createAllStar = function () {
            if(!$.isEmptyObject(vm.allStarData)) {
                AllStars.create(vm.allStarData)
                    .success(function(data) {
                        console.log('allstar saved successfully');
                        vm.allStarData = {}; // clear the form after the new Nerd is created
                        vm.allStars = data;
                    });
            } else {
                console.log('AllStar data is empty');
            }
        };

        vm.deleteAllStar = function(id) {
            AllStars.delete(id)
                .success(function(data) {
                    vm.allStars = data;
                })
        };
    }
);