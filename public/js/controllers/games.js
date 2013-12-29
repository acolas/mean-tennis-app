angular.module('mean.games').controller('GamesController', ['$scope', '$routeParams', '$location', 'Global', 'Games', function ($scope, $routeParams, $location, Global, Games) {
    $scope.global = Global;

    $scope.create = function() {
        this.victory = false;
        if (this.myScore > this.opponent.score)
            this.victory =true;
        var game = new Games({
            opponent: {
                user: this.opponent.user,                
                score: this.opponent.score
            },
            details: {
                victory: this.victory,
                typeOfGame: this.details.typeOfGame,
                official: this.details.official,
                points: 42
            },
            myScore: this.myScore,
            date: this.date
        });
        game.$save(function(response) {
            $location.path("games/" + response._id);
        });


        this.opponent.user = "";
        this.myScore =  "";
        this.opponent.score = "";
        this.victory = false;
        
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