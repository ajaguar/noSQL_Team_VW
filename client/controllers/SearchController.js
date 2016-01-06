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
    .controller('SearchController', ['$scope', '$http', 'esService', function ($scope, $http, esService) {
        $scope.keyword = '';
        $scope.results = [];
        $scope.searchKeyword = function () {
            if ($scope.keyword !== '') {
                esService.subscribe($scope.keyword);
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
        $scope.keyword = '';
        $scope.subscription = [];
        $scope.$on('subscription', function (event, subscription) {
            $scope.subscription = subscription;
            $scope.$apply();
        });

        $scope.notifications = [];
        $scope.$on('newdocfound', function (event, doc) {
            $scope.notifications.push(doc);
            $scope.$digest();
        });

        $scope.removeNotification = function (doc) {
            var position = $scope.notifications.indexOf(doc);
            if (position > -1) {
                $scope.notifications.splice(position, 1);
            }
        };
        $scope.clickAlert = function (data) {
            $scope.keyword = data;
            $scope.searchKeyword();
        };

}]);
