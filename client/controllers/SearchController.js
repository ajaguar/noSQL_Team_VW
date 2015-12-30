/* global angular */

'use strict';

angular.module('esApp.SearchController', [
    'esApp.service.ElasticSearch',
    'esApp.directive.SearchResult',
    'ng'
])
    .controller('SearchController', ['$scope', '$http', 'esService', '$location', function ($scope, $http, esService, $location) {
        var queryKeyword = $location.search().keyword;
        this.results = $scope.results = [];
        this.searchKeyword = function () {
            var requestUrl = 'http://localhost:8888/document?search=' + this.keyword;
            if (queryKeyword != this.keyword) {
                esService.subscribe(this.keyword);
            }
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
        if (queryKeyword) {
            this.keyword = queryKeyword;
            this.searchKeyword();
        } else {
            this.keyword = '';
        }
        $scope.subscription = [];
        $scope.$on('subscription', function (event, subscription) {
            $scope.subscription = subscription;
            $scope.$apply();
        });

}]);