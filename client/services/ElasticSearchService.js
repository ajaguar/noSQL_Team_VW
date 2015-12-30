/* globals angular, Notification, io */

'use strict';

angular.module('esApp.service.ElasticSearch', [
    'ng'
]).factory('esService', ['$rootScope', '$http', 'config', '$location', '$timeout', '$window', function ($rootScope, $http, config, $location, $timeout, $window) {
    /* get notification rights */
    Notification.requestPermission();
    var socket = io();
    socket.on('subscription', function (msg) {
        $rootScope.$broadcast('subscription', msg);
    });
    socket.on('newdocfound', function (msg) {
        $rootScope.$broadcast('newdocfound', msg);
    });

    var requestUrl = config.urlPort();


    /* public methods */

    var subscribe = function (keyword) {
        socket.emit('subscribe', keyword);
    };

    var sendNotification = function (theBody, theTitle) {
        var options = {
            body: theBody,
        };
        var notification = new Notification(theTitle, options);
        return notification;
    };

    var sendNewDocFoundNotification = function (doc) {
        var notification = sendNotification('For your search term "' + doc.keyword + '", filename: "' + doc.filename + '"', 'New document found');
        notification.addEventListener('click', function () {
            /* use $timeout to fix bug reload bug */
            $timeout(function () {
                $location.search('keyword', doc.keyword);
            }, 1);
            $window.focus();
        });
        return notification;
    };

    var search = function (keyword) {
        return $http.get(requestUrl + '/document', {
            'params': {
                'search': keyword
            }
        });
    };

    return {
        subscribe: subscribe,
        sendNotification: sendNotification,
        sendNewDocFoundNotification: sendNewDocFoundNotification,
        search: search
    };
}]);