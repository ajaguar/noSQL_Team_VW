/* globals angular, Notification, io */

'use strict';

angular.module('esApp.service.ElasticSearch', [
    'ng'
]).factory('esService', ['$rootScope', function ($rootScope) {
    /* get notification rights */
    Notification.requestPermission();

    var socket = io();
    socket.on('subscription', function (msg) {
        $rootScope.$broadcast('subscription', msg);
    });
    socket.on('newdocfound', function (msg) {
        $rootScope.$broadcast('newdocfound', msg);
    });

    var subscribe = function (keyword) {
        socket.emit('subscribe', keyword);
    };

    var sendNotification = function (theBody, theTitle) {
        var options = {
            body: theBody,
        };
        var n = new Notification(theTitle, options);
        setTimeout(n.close.bind(n), 5000);
    };

    return {
        subscribe: subscribe,
        sendNotification: sendNotification
    };
}]);