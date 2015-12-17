/* global angular */

'use strict';

angular.module('esApp.SearchController', [
    'esApp.service.ElasticSearch',
    'esApp.directive.SearchResult',
    'ng'
])
    .controller('SearchController', ['$scope', '$http','esService', function ($scope, $http, esService) {
        this.keyword = '';
        this.results = $scope.results = [];
        this.searchKeyword = function () {
            var requestUrl = 'http://localhost:8888/document?search=' + this.keyword;
            esService.subscribe(this.keyword);
            // remove all results
            $scope.results = $scope.results.splice(0, $scope.results.length);
            $http.get(requestUrl)
                .success(function (data) {
                    // add all results
                    angular.forEach(data.hits, function (hit) {
                        $scope.results.push(hit);
                    });
                })
                .error(function () {});
        };
        $scope.subscription = [];
        
        
        $scope.$on("subscription", function(event, subscription) {
            $scope.subscription = subscription;
            $scope.$apply();
        });
        
}]);
