/* global angular */

'use strict';

angular.module('esApp.directive.KeywordInput', [
    'ng'
])
    .directive('keywordInput', ['$timeout', function ($timeout) {
        return {
            scope: {
                keywordInput: '='
            },
            link: function (scope, element) {
                element.bind("keypress paste", function (e) {
                    $timeout(function () {
                        scope.keywordInput = scope.keywordInput.replace(/[^\w\u00C0-\u017F]+/gi, '').toLowerCase();
                    }, 1);
                 });
            }
        };
    }]);