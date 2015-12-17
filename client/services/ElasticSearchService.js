/* global angular */

'use strict';

angular.module('esApp.service.ElasticSearch', [
    'ng'
]).factory('esService', ['$rootScope', function ($rootScope) {
    var socket = io();
    socket.on("subscription", function (msg) {
        $rootScope.$broadcast("subscription", msg);
    });
    socket.on("newdocfound", function (msg) {
        console.log("broadcasting new docofund");
        $rootScope.$broadcast("newdocfound", msg);
    });
    
    return {
        subscribe: function (keyword) {
            socket.emit("subscribe", keyword);
        }

    };
}]);