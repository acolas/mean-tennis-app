/**
 * Created by Anthony on 02/01/14.
 */
//index service used for articles REST endpoint
angular.module('mean.system').factory("Index", ['$resource', function($resource) {
    return $resource('index/:gameId', {
        gameId: '@_id'
    });
}]);