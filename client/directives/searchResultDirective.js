/* global angular */

'use strict';

angular.module('esApp.directive.SearchResult', [
    'ng'
])
    .directive('searchresult', function () {
        return {
            restrict: 'E',
            scope: {
                hit: '='
            },
            templateUrl: '/directives/searchResultTpl.html'
        };
    });
