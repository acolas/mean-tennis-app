angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Games', 'Users', function ($scope, Global, Games, Users) {
    $scope.global = Global;

    //objet contenant les variables dyn
    var chart = {};

    //nombre de match à afficher dans le tableau pour l utilisateur courant
    $scope.quantity = 10;


    //merge array and sum les points pour une meme date
    var sum = function (array) {
        var result = array.reduce(function (ob, ar) {
            if (!(ar[0] in ob.nums)) {
                ob.nums[ar[0]] = ar;
                ob.result.push(ar);
            } else
                ob.nums[ar[0]][1] += ar[1];
            return ob;
        }, {nums: {}, result: []}).result
            .sort(function (a, b) {
                return a[0] - b[0];
            });
        return result;
    };


    //on recupere les infos pour le le dashboard
    $scope.find = function () {
    $scope.gamesFiltered = [];
        Games.query(function (games) {
            //$scope.games = games;
            $scope.myTotalScore = 0;

            //$scope.arrayDateAndScore = [];
            //$scope.arrayDateAndRank = [];

            $scope.usersArray = [];
            $scope.user0Games = 0;
            $scope.user1Games = 0;
            $scope.user2Games = 0;

            //on recupere les infos de chaque match
            jQuery.each(games, function (index) {
                // on verifie si l user existe
                var resultUserAlready = jQuery.grep($scope.usersArray, function (e) {
                    return e._id === games[index].user._id;
                });
                if (resultUserAlready.length === 0) {
                    $scope.usersArray.push(games[index].user);
                    chart[games[index].user.email] = [];
                    chart["rank_" + games[index].user.email] = [];
                }
                // on verifie si l user existe avant de le mettre dans le tableau
                var resultOpponentUserAlready = jQuery.grep($scope.usersArray, function (e) {
                    return e._id === games[index].opponent.user._id;
                });
                if (resultOpponentUserAlready.length === 0) {
                    $scope.usersArray.push(games[index].opponent.user);
                    chart[games[index].opponent.user.email] = [];
                    chart["rank_" + games[index].opponent.user.email] = [];
                }
                //on ajoute les points au bon utilisateur
                var arraySingleScore = [];
                var arrayTotalScore = [];
                var totalScore = 0;
                var dateOfMatch = moment.parseZone(this.date).add('days', 1).format("DD-MMM-YYYY");

                arraySingleScore.push(dateOfMatch);
                arrayTotalScore.push(dateOfMatch);
                arraySingleScore.push(games[index].details.points);

                var indexLength = 0;

                //si le user 1 a gagné
                if (games[index].details.victory) {
                    chart[games[index].user.email].push(arraySingleScore);
                    indexLength = chart["rank_" + games[index].user.email].length - 1;
                    //find user and add score by date
                    if (chart["rank_" + games[index].user.email][0] === undefined) {
                        totalScore =  games[index].details.points;
                    }
                    else {
                        totalScore = chart["rank_" + games[index].user.email][indexLength][1] + games[index].details.points;
                    }
                    arrayTotalScore.push(totalScore);
                    console.log("user : " + games[index].user.email + " totalScore :  " + totalScore);

                    chart["rank_" + games[index].user.email].push(arrayTotalScore);
                } else {
                    chart[games[index].opponent.user.email].push(arraySingleScore);
                    //find user and add score by date
                    indexLength = chart["rank_" + games[index].opponent.user.email].length  - 1;
                    if (chart["rank_" + games[index].opponent.user.email][0] === undefined) {
                        totalScore =  games[index].details.points;
                    }
                    else {
                        totalScore = chart["rank_" + games[index].opponent.user.email][indexLength][1] + games[index].details.points;
                    }
                    arrayTotalScore.push(totalScore);
                    console.log("opponent user : " + games[index].opponent.user.email + " totalScore :  " + totalScore);

                    chart["rank_" + games[index].opponent.user.email].push(arrayTotalScore);
                }

                if (games[index].opponent.user._id === Global.user._id || games[index].user._id === Global.user._id) {
                    $scope.gamesFiltered.push(games[index]);
                }

                if (games[index].opponent.user.firstName === "Bruno" || games[index].user.firstName === "Bruno") {
                    $scope.user0Games++;
                }

                if (games[index].opponent.user.firstName === "Matthieu" || games[index].user.firstName === "Matthieu") {
                    $scope.user1Games++;
                }

                if (games[index].opponent.user.firstName === "Anthony" || games[index].user.firstName === "Anthony") {
                    $scope.user2Games++;
                }

             });


            //TODO rendre dynamique en fonction du nombre de users avec les contraintes jqplot

            //calcul des points + somme des valeurs pour une meme date

            $scope.user0NumberOfVictories = chart[$scope.usersArray[0].email].length;
            $scope.user1NumberOfVictories = chart[$scope.usersArray[1].email].length;
            $scope.user2NumberOfVictories = chart[$scope.usersArray[2].email].length;


            $scope.chartUser0Results = sum(chart[$scope.usersArray[0].email]);
            $scope.chartUser1Results = sum(chart[$scope.usersArray[1].email]);
            $scope.chartUser2Results = sum(chart[$scope.usersArray[2].email]);

            //calcul du classement (charts)
            $scope.chartUser0Ranks = chart["rank_" + $scope.usersArray[0].email];
            $scope.chartUser1Ranks = chart["rank_" + $scope.usersArray[1].email];
            $scope.chartUser2Ranks = chart["rank_" + $scope.usersArray[2].email];

            //calcul du classement texte
            $scope.chartUser0RanksScore = [chart["rank_" + $scope.usersArray[0].email][chart["rank_" + $scope.usersArray[0].email].length - 1][1], $scope.usersArray[0].rank];
            $scope.chartUser1RanksScore = [chart["rank_" + $scope.usersArray[1].email][chart["rank_" + $scope.usersArray[1].email].length - 1][1], $scope.usersArray[1].rank];
            $scope.chartUser2RanksScore = [chart["rank_" + $scope.usersArray[2].email][chart["rank_" + $scope.usersArray[2].email].length - 1][1], $scope.usersArray[2].rank];

            //FIN TODO

            $scope.chartOptionsDateAndScore = {
                // Turns on animatino for all series in this plot.
                //animate: false,
                // Will animate plot on calls to plot1.replot({resetAxes:true})
                //animateReplot: false,
                cursor: {
                    show: true,
                    zoom: true,
                    looseZoom: true,
                    showTooltip: false
                },
                title: 'Nombre de points gagnés par date',
                axes: {
                    xaxis: {
                        renderer: jQuery.jqplot.DateAxisRenderer,
                        tickOptions: {
                            formatString: '%d/%m/%Y'
                        }
                    }
                },
                legend: {
                    show: true,
                    location: 'ne',     // compass direction, nw, n, ne, e, se, s, sw, w.
                    xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
                    yoffset: 12        // pixel offset of the legend box from the y (or y2) axis.
                },
                series: [
                    {label: $scope.usersArray[2].firstName},
                    {label: $scope.usersArray[1].firstName},
                    {label: $scope.usersArray[0].firstName}
                ],
                highlighter: {
                    show: true,
                    showLabel: true,
                    tooltipAxes: 'y',
                    sizeAdjust: 7.5, tooltipLocation: 'ne'
                }
            };

            $scope.chartOptionsDateAndRank = {
                // Turns on animatino for all series in this plot.
                //animate: false,
                // Will animate plot on calls to plot1.replot({resetAxes:true})
                //animateReplot: false,
                cursor: {
                    show: true,
                    zoom: true,
                    looseZoom: true,
                    showTooltip: false
                },
                title: 'Classement par date',
                axes: {
                    xaxis: {
                        renderer: jQuery.jqplot.DateAxisRenderer,
                        tickOptions: {
                            formatString: '%d/%m/%Y'
                        }
                    }
                },
                legend: {
                    show: true,
                    location: 'se',     // compass direction, nw, n, ne, e, se, s, sw, w.
                    xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
                    yoffset: 12        // pixel offset of the legend box from the y (or y2) axis.
                },
                series: [
                    {label: $scope.usersArray[2].firstName/*, rendererOptions: {
                        smooth: true
                    }*/},
                    {label: $scope.usersArray[1].firstName},
                    {label: $scope.usersArray[0].firstName},
                    {
                        lineWidth: 4,
                        markerOptions: {
                            style: 'square'
                        }
                    }
                ],
                highlighter: {
                    show: true,
                    showLabel: true,
                    tooltipAxes: 'y',
                    sizeAdjust: 7.5, tooltipLocation: 'ne'
                }
            };

        });
    };
}]);

