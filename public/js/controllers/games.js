angular.module('mean.games').controller('GamesController', ['$scope', '$routeParams', '$location', 'Global', 'Games', function ($scope, $routeParams, $location, Global, Games) {
    $scope.global = Global;

    $scope.create = function() {
        var game = new Games({
            opponentUser: this.opponentUser,
            myScore: this.myScore,
            opponentScore: this.opponentScore,
            typeOfGame: this.typeOfGame,
            official: this.official,
            date: this.date,
            points: 42
        });
        game.$save(function(response) {
            $location.path("games/" + response._id);
        });


        this.opponentUser = "";
        this.myScore =  "";
        this.opponentScore = "";
        
    };



    $scope.find = function() {
        Games.query(function(games) {
            $scope.games = games;
        });
    };


    $scope.findOne = function() {
        Games.get({
            gameId: $routeParams.gameId
        }, function(game) {
            $scope.game = game;
        });
        };
 /*   $scope.remove = function(article) {
        if (article) {
            article.$remove();  

            for (var i in $scope.articles) {
                if ($scope.articles[i] == article) {
                    $scope.articles.splice(i, 1);
                }
            }
        }
        else {
            $scope.article.$remove();
            $location.path('articles');
        }
    };

    $scope.update = function() {
        var article = $scope.article;
        if (!article.updated) {
            article.updated = [];
        }
        article.updated.push(new Date().getTime());

        article.$update(function() {
            $location.path('articles/' + article._id);
        });
    };

    $scope.find = function() {
        Articles.query(function(articles) {
            $scope.articles = articles;
        });
    };

    $scope.findOne = function() {
        Articles.get({
            articleId: $routeParams.articleId
        }, function(article) {
            $scope.article = article;
        });
    };*/
}]);