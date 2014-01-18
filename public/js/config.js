//Setting up route
angular.module('mean').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/games', {
                templateUrl: 'views/games/list.html'
            }).
            when('/rules', {
                templateUrl: 'views/rules/view.html'
            }).
            when('/stack', {
                templateUrl: 'views/stack/view.html'
            }).
            when('/games/create', {
                templateUrl: 'views/games/create.html'
            }).
            when('/games/:gameId', {
                templateUrl: 'views/games/view.html'
            }).
            when('/users/:userId', {
                templateUrl: 'views/users/view.html'
            }).
            when('/', {
                templateUrl: 'views/index.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function ($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);