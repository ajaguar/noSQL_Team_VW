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
    }).run(['$rootScope', 'esService', function ($rootScope, esService) {
        $rootScope.$on('newdocfound', function (event, doc) {
            esService.sendNewDocFoundNotification(doc);
        });
}]);
