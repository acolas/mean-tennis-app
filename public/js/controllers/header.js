angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Classement",
        "link": "articles"
    }, {
        "title": "Saisir un score",
        "link": "articles/create"
    }, {
        "title": "Historique",
        "link": "articles/create"
    }, {
        "title": "Règlement",
        "link": "articles/create"
    }];
    
    $scope.isCollapsed = false;
}]);