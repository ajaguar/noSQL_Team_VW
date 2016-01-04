/* global angular */

'use strict';

angular.module('esApp.SearchController', [
    'esApp.service.ElasticSearch',
    'esApp.directive.SearchResult',
    'esApp.directive.KeywordInput',
    'ng'
]).filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
    .controller('SearchController', ['$scope', '$http', 'esService', '$location', function ($scope, $http, esService, $location) {
        $scope.queryKeyword = $location.search().keyword;
        var ctrl = this;

        $scope.$on('$routeUpdate', function () {
            if ($location.search().keyword && $location.search().keyword != ctrl.keyword) {
                ctrl.keyword = $location.search().keyword;
                ctrl.queryKeyword = ctrl.keyword;
                ctrl.searchKeyword();
            }
        });

        $scope.keyword = '';
        $scope.results = $scope.results = [];
        $scope.searchKeyword = function () {
            if ($scope.keyword !== '') {
                /* if the current keyword is not sent via url -> subscribe keyword */
                if ($scope.queryKeyword != $scope.keyword) {
                    esService.subscribe($scope.keyword);
                }
                // remove all results
                $scope.results.splice(0, $scope.results.length);
                var searchResult = esService.search($scope.keyword);
                searchResult.success(function (data) {
                        $scope.results.splice(0, $scope.results.length);
                        // add all results
                        angular.forEach(data.hits, function (hit) {
                            $scope.results.push(hit);
                        });
                    })
                    .error(function () {});
            } else {
                $scope.results.splice(0, $scope.results.length);
            }
        };
        if ($scope.queryKeyword) {
            $scope.keyword = $scope.queryKeyword;
            $scope.searchKeyword();
        } else {
            $scope.keyword = '';
        }
        $scope.subscription = [];
        $scope.$on('subscription', function (event, subscription) {
            $scope.subscription = subscription;
            $scope.$apply();
        });

}]);
