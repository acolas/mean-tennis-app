angular.module('mean.games').controller('GamesController', ['$scope', '$routeParams', '$location', 'Global', 'Games', function ($scope, $routeParams, $location, Global, Games) {
    $scope.global = Global;
  
    $scope.create = function() {
        
        //calcul du nb de points en fonction du type de match
        switch (this.details.typeOfGame){
            case 'OneSet':
                this.points = 25;
                break;
            case 'TwoSets':
                this.points = 50;
                break;
            case 'ThreeSets':
                this.points = 100;
                break;
            case 'TieBreak':
                this.points = 5;
                break;
        }

        //ajout d un boolean pour l utilisation d'une classe CCS speciale en cas de victoire
        this.victory = false;
        if (this.myScore > this.opponent.score)
            this.victory =true;

        //Création et sauvegarde de l'objet jeu
        var game = new Games({
            opponent: {
                user: this.opponent.user,                
                score: this.opponent.score
            },
            details: {
                victory: this.victory,
                typeOfGame: this.details.typeOfGame,
                official: this.details.official,
                points: this.points
            },
            myScore: this.myScore,
            date: this.date
        });

        //on redirige vers la fiche du match lors de la création du match
        game.$save(function(response) {
            $location.path("games/" + response._id);
        });

        //reinit
        this.opponent.user = "";
        this.myScore =  "";
        this.opponent.score = "";
        this.victory = false;
        this.points = 0;        
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