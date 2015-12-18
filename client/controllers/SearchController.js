/* global angular */

'use strict';

angular.module('esApp.SearchController', [
    'esApp.service.ElasticSearch',
    'esApp.directive.SearchResult',
    'ng'
])
    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
    .controller('SearchController', (['$scope', '$http', function ($scope, $http) {
        this.keyword = '';
        this.results = $scope.results = [];
        this.searchKeyword = function () {
            var requestUrl = 'http://localhost:8888/document?search=' + this.keyword;
            // remove all results
            $scope.results = $scope.results.splice(0, $scope.results.length);
            $http.get(requestUrl)
                .success(function (data) {
                    console.log(data);
                    // add all results
                    angular.forEach(data.hits, function (hit) {
                        $scope.results.push(hit);
                    });
                })
                .error(function () {});
        };
}]));
