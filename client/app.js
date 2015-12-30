/* global angular */

'use strict';

angular.module('esApp', [
    'esApp.MainController',
    'esApp.UploadController',
    'esApp.SearchController',
    'esApp.service.ElasticSearch',
    'ngRoute',
    'ng'
]).config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/searchTpl.html',
            controller: 'SearchController as search'
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
}).run(['$rootScope', 'esService', function ($rootScope, esService) {
    $rootScope.$on('newdocfound', function (event, doc) {
        esService.sendNotification('For your search term "'+doc.searchTerm+'", filename: "'+doc.filename+'"', 'New document found');
    });
}]);