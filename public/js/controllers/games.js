angular.module('mean.games').controller('GamesController', ['$scope', '$routeParams', '$location', 'Global', 'Games', 'Users', function ($scope, $routeParams, $location, Global, Games, Users) {
    $scope.global = Global;
  
    $scope.create = function() {


        //ajout d un boolean pour l utilisation d'une classe CCS speciale en cas de victoire
        this.victory = false;
        if (this.myScore > this.opponentScore)
            this.victory =true;

        //Création et sauvegarde de l'objet jeu

        console.log(this.score);
        var arrayScoreOpponent1 = [];
        var arrayScoreOpponent2 = [];
        for (var i= 0; i < this.score.options.length; i++){
            arrayScoreOpponent1.push(this.score.options[i].scoreOpponent1);
            arrayScoreOpponent2.push(this.score.options[i].scoreOpponent2);
        }

        if (this.score.option_new.scoreOpponent1){
            arrayScoreOpponent1.push(this.score.option_new.scoreOpponent1);
        }
        if (this.score.option_new.scoreOpponent2){
            arrayScoreOpponent2.push(this.score.option_new.scoreOpponent2);
        }
        var game = new Games({
            score: {
                scoreOpponent1 : arrayScoreOpponent1,
                scoreOpponent2: arrayScoreOpponent2
            },
            opponent: {
                _id: this.opponentUser._id,
                score: this.opponentScore
            },
            details: {
                victory: this.victory,
                typeOfGame: this.details.typeOfGame,
                //NEXT
                //official: this.details.official,
                points: 0
            },
            myScore: this.myScore,
            date: this.date
        });


        if (this.user) {
            game.user = {
                _id: this.user._id
            };
        }

        //on redirige vers la fiche du match lors de la création du match
        game.$save(function(response) {
            $location.path("games/" + response._id);
        });

        //reinit
        this.opponentUser = "";
        this.myScore =  "";
        this.opponentScore = "";
        this.victory = false;
        this.points = 0;        
    };


    $scope.find = function() {
        //hack due to bug CastError -> see apps > controllers > games.js
        Games.query(function(games) {
            /*jQuery.each(games, function (index) {
                Users.get({
                    userId: this.opponent.user
                }, function(user) {
                    games[index].opponent.user = user;
                });
            });*/
            $scope.games = games;
        });
    };

    $scope.findOne = function() {
        Games.get({
            gameId: $routeParams.gameId
        }, function(game) {
            /*Users.get({
                userId: game.opponent.user
            }, function(user) {
                game.opponent.user = user;
            });*/
            $scope.game = game;
        });
        };


    $scope.findOneUser = function () {
        Users.get({
            userId: $scope.game.opponent.user
        }, function(user) {
            $scope.game.opponent.user = user;
        });
    };

    $scope.findUsers = function () {
        Users.query(function (users) {
            $scope.users = [];

            jQuery.each(users, function () {
                if (Global.user._id !== this._id){
                    $scope.users.push(this);
                }
            });

        });
    };

    $scope.findAllUsers = function () {
        Users.query(function (users) {
            $scope.allUsers = users;
        });
    };


    // options date Picker
    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };


    $scope.score = {
        options: [],
        option_new: { scoreOpponent1: '', scoreOpponent2: '' }
    };

    $scope.add = function() {
        // add the new option to the model
        $scope.score.options.push($scope.score.option_new);
        // clear the option.
        $scope.score.option_new = { scoreOpponent1: '', scoreOpponent2: '' };
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