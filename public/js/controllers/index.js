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
        return result;
    };

    //on recupere les infos pour le le dashboard
    $scope.find = function () {

        Games.query(function (games) {
            $scope.games = games;
            $scope.myTotalScore = 0;

            //$scope.arrayDateAndScore = [];
            //$scope.arrayDateAndRank = [];

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
            });


            //TODO rendre dynamique en fonction du nombre de users avec les contraintes jqplot

            //calcul des points + somme des valeurs pour une meme date
            $scope.chartUser0Results = sum(chart[$scope.usersArray[0].email]);
            $scope.chartUser1Results = sum(chart[$scope.usersArray[1].email]);
            $scope.chartUser2Results = sum(chart[$scope.usersArray[2].email]);

            //calcul du classement
            $scope.chartUser0Ranks = chart["rank_" + $scope.usersArray[0].email];
            $scope.chartUser1Ranks = chart["rank_" + $scope.usersArray[1].email];
            $scope.chartUser2Ranks = chart["rank_" + $scope.usersArray[2].email];

            //calcul du classement
            $scope.chartUser0RanksScore = chart["rank_" + $scope.usersArray[0].email][chart["rank_" + $scope.usersArray[0].email].length - 1][1];
            $scope.chartUser1RanksScore = chart["rank_" + $scope.usersArray[1].email][chart["rank_" + $scope.usersArray[1].email].length - 1][1];
            $scope.chartUser2RanksScore = chart["rank_" + $scope.usersArray[2].email][chart["rank_" + $scope.usersArray[2].email].length - 1][1];

            //FIN TODO

            //on recupere les infos de chaque match
            jQuery.each($scope.usersArray, function (index) {
                if ($scope.usersArray[index]._id === Global.user._id) {
                    $scope.myTotalScore = chart["rank_" + $scope.usersArray[index].email][chart["rank_" + $scope.usersArray[index].email].length - 1][1];
                }

            });


            $scope.chartOptionsDateAndScore = {
                title: 'Nombre de points gagnés par date',
                axes: {
                    xaxis: {
                        renderer: jQuery.jqplot.DateAxisRenderer,
                        tickOptions: {
                            formatString: '%b&nbsp;%#d'
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
                    {label: $scope.usersArray[0].firstName},
                    {
                        lineWidth: 4,
                        markerOptions: {
                            style: 'square'
                        }
                    }
                ]
            };

            $scope.chartOptionsDateAndRank = {
                title: 'Classement par date',
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
                    {label: $scope.usersArray[2].firstName},
                    {label: $scope.usersArray[1].firstName},
                    {label: $scope.usersArray[0].firstName},
                    {
                        lineWidth: 4,
                        markerOptions: {
                            style: 'square'
                        }
                    }
                ]
            };

        });
    };

}]);


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
 };*/





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
