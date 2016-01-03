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
        this.queryKeyword = $location.search().keyword;
        var ctrl = this;

        $scope.$on('$routeUpdate', function () {
            if ($location.search().keyword && $location.search().keyword != ctrl.keyword) {
                ctrl.keyword = $location.search().keyword;
                ctrl.queryKeyword = ctrl.keyword;
                ctrl.searchKeyword();
            }
        });

        this.keyword = '';
        this.results = $scope.results = [];
        this.searchKeyword = function () {
            if (this.keyword !== '') {
                /* if the current keyword is not sent via url -> subscribe keyword */
                if (this.queryKeyword != this.keyword) {
                    esService.subscribe(this.keyword);
                }
                // remove all results
                $scope.results.splice(0, $scope.results.length);
                var searchResult = esService.search(this.keyword);
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
        if (this.queryKeyword) {
            this.keyword = this.queryKeyword;
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