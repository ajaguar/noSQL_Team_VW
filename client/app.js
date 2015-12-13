/* global angular */

'use strict';

angular.module('esApp', [
    'esApp.MainController',
    'esApp.UploadController',
    'esApp.SearchController',
    'ngRoute',
    'ng'
]).config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/searchTpl.html',
            controller: 'SearchController'
        })
        .when('/search', {
            redirectTo: '/'
        })
        .when('/upload', {
            templateUrl: 'views/uploadTpl.html',
            controller: 'UploadController'
        })
        .otherwise({
            template: '404 not Found'
        });
});
