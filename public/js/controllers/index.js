angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Games', 'Users', function ($scope, Global, Games, Users) {
    $scope.global = Global;
    $scope.quantity = 5;

    $scope.find = function () {
        Games.query(function (games) {


            $scope.games = games;
            $scope.myTotalScore = 0;

            $scope.arrayDateAndScore = [];
            $scope.arrayDateAndRank = [];

            jQuery.each(games, function (index) {

                //get opponent user
                Users.get({
                    userId: this.opponent.user
                }, function(user) {
                    games[index].opponent.user = user;
                });

                // my score
                if (this.details.victory && (Global.user._id === this.user._id)) {
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
            });

            // merge array and sum same key values
            var sums = {};
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
            }

            $scope.myScore = resultsArrayDateAndScore;
            $scope.myRank = resultsArrayDateAndRank;

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