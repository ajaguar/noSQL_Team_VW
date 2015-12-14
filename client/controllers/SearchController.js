/* global angular */

'use strict';

angular.module('esApp.SearchController', [
    'esApp.service.ElasticSearch',
    'ng'
]).controller('SearchController', (['$scope', '$http', function ($scope, $http) {
    this.keyword = '';
    this.searchKeyword = function () {
        var requestUrl = 'http://localhost:8888/document?search=' + this.keyword;
        $http.get(requestUrl)
            .success(function (data) {
                console.log(data);
            })
            .error(function () {});
    };
}]));
