angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [ {
        "title": "Saisir un score",
        "link": "games/create"
    }, {
        "title": "Historique",
        "link": "games"
    }, {
        "title": "Règlement",
        "link": "rules"
    }, {
        "title": "A propos",
        "link": "stack"
    }];
    
    $scope.isCollapsed = false;
}]);