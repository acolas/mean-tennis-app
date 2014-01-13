angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Games', 'Users', function ($scope, Global, Games, Users) {
    $scope.global = Global;

    //objet contenant les variables dyn
    var chart = {};

    //nombre de match à afficher dans le tableau pour l utilisateur courant
    $scope.quantity = 5;


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

        console.log("result : " + result);
        return result;
    };

    //on recupere les infos pour le le dashboard
    $scope.find = function () {

        Games.query(function (games) {
            $scope.games = games;
            $scope.myTotalScore = 0;

            $scope.arrayDateAndScore = [];
            $scope.arrayDateAndRank = [];

            $scope.usersArray = [];

            //on recupere les infos de chaque match
            jQuery.each(games, function (index) {

                // on verifie si l user existe
                var resultUserAlready = jQuery.grep($scope.usersArray, function (e) {
                    return e._id === games[index].user._id;
                });
                if (resultUserAlready.length === 0) {
                    $scope.usersArray.push(games[index].user);
                    chart[games[index].user.email] = [];
                    chart["rank_"+games[index].user.email] = [];
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
                var array = [];
                array.push(moment.parseZone(this.date).format("DD-MMM-YYYY"));
                array.push(games[index].details.points);
                if (games[index].myScore > games[index].opponent.score) {
                    chart[games[index].user.email].push(array);
                    chart["rank_" + games[index].user.email].push(array);
                } else {
                    chart[games[index].opponent.user.email].push(array);
                    chart["rank_" + games[index].opponent.user.email].push(array);
                }

            });

            $scope.chartUser0Results = sum(chart[$scope.usersArray[0].email]);
            $scope.chartUser1Results = sum(chart[$scope.usersArray[1].email]);
            $scope.chartUser2Results = sum(chart[$scope.usersArray[2].email]);

            $scope.chartUserORank = chart["rank_" + $scope.usersArray[0].email];

            //score of the others
            //console.dir($scope.usersArray);
            /*
             if (Global.user._id === this.user._id) {
             $scope.arrayGame = [];
             $scope.arrayRank = [];
             $scope.arrayGame.push(moment.parseZone(this.date).format("DD-MMM-YYYY"));
             $scope.arrayRank.push(moment.parseZone(this.date).format("DD-MMM-YYYY"));
             $scope.myTotalScore += this.details.points;
             $scope.arrayRank.push($scope.myTotalScore);
             $scope.arrayGame.push(this.details.points);
             $scope.arrayDateAndScore.push($scope.arrayGame);
             $scope.arrayDateAndRank.push($scope.arrayRank);
             }
             /*
             if (Global.user._id !== this.user._id) {
             //ajout du score et des dates pour les autres joueurs
             console.log("id opponent : " + this.opponent.user);
             if(jQuery.inArray(this.opponent.user, $scope.usersArray) !== -1){
             console.log("victoire ? " + this.details.victory);
             console.log("le gagnant du match est : " + this.opponent.user);
             console.log("le nombre de points gagnés est : " + this.details.points);
             console.log("en date du : " + moment.parseZone(this.date).format("DD-MMM-YYYY"));
             }
             }


             });
             */

            // merge array and sum same key values
            /* var sums = {};
             [$scope.arrayDateAndScore].forEach(function (array) {
             array.forEach(function (pair) {
             sums[pair[0]] = pair[1] + (sums[pair[0]] || 0);
             });
             });

             var resultsArrayDateAndScore = [];
             for (var key in sums) {
             resultsArrayDateAndScore.push([key, sums[key]]);
             }

             // REFACTOR : merge array and sum same key values
             var sums2 = {};
             [$scope.arrayDateAndRank].forEach(function (array) {
             array.forEach(function (pair) {
             sums2[pair[0]] = pair[1];
             });
             });
             var resultsArrayDateAndRank = [];
             for (var key2 in sums2) {
             resultsArrayDateAndRank.push([key2, sums2[key2]]);
             }*/

            //$scope.myScore = resultsArrayDateAndScore;
            //$scope.myRank = resultsArrayDateAndRank;

            $scope.Score1 = [
                ["01-Jan-2014", 20],
                ["04-Jan-2014", 10],
                ["05-Jan-2014", 5],
                ["06-Jan-2014", 50],
                ["07-Jan-2014", 200]
            ];
            $scope.Rank1 = [
                ["01-Jan-2014", 20],
                ["04-Jan-2014", 30],
                ["05-Jan-2014", 35],
                ["06-Jan-2014", 85],
                ["07-Jan-2014", 285]
            ];

            $scope.Score2 = [
                ["01-Jan-2014", 5],
                ["04-Jan-2014", 5],
                ["05-Jan-2014", 5],
                ["06-Jan-2014", 5],
                ["07-Jan-2014", 5]
            ];
            $scope.Rank2 = [
                ["01-Jan-2014", 5],
                ["04-Jan-2014", 10],
                ["05-Jan-2014", 15],
                ["06-Jan-2014", 20],
                ["07-Jan-2014", 25]
            ];


            $scope.chartOptionsDate = {
                title: 'Default Date Axis',
                axes: {
                    xaxis: {
                        renderer: jQuery.jqplot.DateAxisRenderer
                    }
                },
                legend: {
                    show: true,
                    location: 'ne',     // compass direction, nw, n, ne, e, se, s, sw, w.
                    xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
                    yoffset: 12        // pixel offset of the legend box from the y (or y2) axis.
                },
                series: [
                    {
                        lineWidth: 4,
                        markerOptions: {
                            style: 'square'
                        }
                    }
                ]
            };

            $scope.chartOptions = {
                // Turns on animatino for all series in this plot.
                animate: true,
                // Will animate plot on calls to plot1.replot({resetAxes:true})
                animateReplot: true,
                cursor: {
                    show: true,
                    zoom: true,
                    looseZoom: true,
                    showTooltip: false
                },
                series: [
                    {
                        pointLabels: {
                            show: true
                        },
                        renderer: jQuery.jqplot.BarRenderer,
                        showHighlight: false,
                        yaxis: 'y2axis',
                        rendererOptions: {
                            // Speed up the animation a little bit.
                            // This is a number of milliseconds.
                            // Default for bar series is 3000.
                            animation: {
                                speed: 2500
                            },
                            barWidth: 15,
                            barPadding: -15,
                            barMargin: 0,
                            highlightMouseOver: false
                        }
                    },
                    {
                        rendererOptions: {
                            // speed up the animation a little bit.
                            // This is a number of milliseconds.
                            // Default for a line series is 2500.
                            animation: {
                                speed: 2000
                            }
                        }
                    }
                ],
                axesDefaults: {
                    pad: 0
                },
                axes: {
                    // These options will set up the x axis like a category axis.
                    xaxis: {
                        renderer: jQuery.jqplot.DateAxisRenderer,
                        tickOptions: {
                            formatString: '%b&nbsp;%#d'
                        }
                    },
                    yaxis: {
                        tickOptions: {
                            formatString: "%'d"
                        },
                        rendererOptions: {
                            forceTickAt0: true
                        }
                    },
                    y2axis: {
                        tickOptions: {
                            formatString: "%'d"
                        },
                        rendererOptions: {
                            // align the ticks on the y2 axis with the y axis.
                            alignTicks: true,
                            forceTickAt0: true
                        }
                    }
                },
                highlighter: {
                    show: true,
                    showLabel: true,
                    tooltipAxes: 'y',
                    sizeAdjust: 7.5, tooltipLocation: 'ne'
                }
            };
        });
    };


    //$scope.s1 = [['2008-09-30 4:00PM',4], ['2008-10-30 4:00PM',6.5], ['2008-11-30 4:00PM',5.7], ['2008-12-30 4:00PM',9], ['2009-01-30 4:00PM',8.2]];

    //console.log($scope.s1);
    //$scope.s2 = [['2013-12-12', 10200], ['2013-12-13', 10800]];

    /*$scope.chartOptions = {
     title:'Default Date Axis',
     axes:{
     xaxis:{
     renderer:jQuery.jqplot.DateAxisRenderer
     }
     },
     series:[{
     lineWidth:4,
     markerOptions:{
     style:'square'
     }
     }]
     };$/
     /*$scope.chartOptions = {
     // Turns on animatino for all series in this plot.
     animate: true,
     // Will animate plot on calls to plot1.replot({resetAxes:true})
     animateReplot: true,
     cursor: {
     show: true,
     zoom: true,
     looseZoom: true,
     showTooltip: false
     },
     series:[
     {
     pointLabels: {
     show: true
     },
     renderer: jQuery.jqplot.BarRenderer,
     showHighlight: false,
     yaxis: 'y2axis',
     rendererOptions: {
     // Speed up the animation a little bit.
     // This is a number of milliseconds.
     // Default for bar series is 3000.
     animation: {
     speed: 2500
     },
     barWidth: 15,
     barPadding: -15,
     barMargin: 0,
     highlightMouseOver: false
     }
     },
     {
     rendererOptions: {
     // speed up the animation a little bit.
     // This is a number of milliseconds.
     // Default for a line series is 2500.
     animation: {
     speed: 2000
     }
     }
     }
     ],
     axesDefaults: {
     pad: 0
     },
     axes: {
     // These options will set up the x axis like a category axis.
     xaxis: {
     renderer:jQuery.jqplot.DateAxisRenderer,
     tickOptions:{
     formatString:'%b&nbsp;%#d'
     }
     },
     yaxis: {
     tickOptions: {
     formatString: "$%'d"
     },
     rendererOptions: {
     forceTickAt0: true
     }
     },
     y2axis: {
     tickOptions: {
     formatString: "$%'d"
     },
     rendererOptions: {
     // align the ticks on the y2 axis with the y axis.
     alignTicks: true,
     forceTickAt0: true
     }
     }
     },
     highlighter: {
     show: true,
     showLabel: true,
     tooltipAxes: 'y',
     sizeAdjust: 7.5 , tooltipLocation : 'ne'
     }
     };*/

}]);