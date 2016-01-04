/* global angular */

'use strict';

angular.module('esApp', [
    'esApp.MainController',
    'esApp.UploadController',
    'esApp.SearchController',
    'esApp.service.ElasticSearch',
    'ngRoute',
    'ng'
]).constant('config', {
        'url': 'http://localhost',
        'port': '8888',
        'urlPort': (function () {
            return this.url + ':' + this.port;
        })
    })
    /*.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/searchTpl.html',
            controller: 'SearchController as search',
            reloadOnSearch: false
        })
        .when('/search', {
            redirectTo: '/'
        })
        .when('/upload', {
            templateUrl: 'views/uploadTpl.html',
            controller: 'UploadController as upload'
        })
        .otherwise({
            template: '404 not Found'
        });
}])*/
    .run(['$rootScope', 'esService', function ($rootScope, esService) {
        $rootScope.$on('newdocfound', function (event, doc) {
            esService.sendNewDocFoundNotification(doc);
        });
}]);
