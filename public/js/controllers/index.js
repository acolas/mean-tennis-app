angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
	$scope.global = Global;

$scope.someData = [[
['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14],
['Out of home', 16],['Commuting', 7], ['Orientation', 9]
]];


$scope.pieChartOptions = { 
	seriesDefaults: {
		renderer: jQuery.jqplot.PieRenderer,
		rendererOptions: {
		showDataLabels: true
		}
	},
	legend: { show:true, location: 'e' }
};

}]);