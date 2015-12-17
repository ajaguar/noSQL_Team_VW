/* global angular */

'use strict';

angular.module('esApp.service.ElasticSearch', [
    'ng'
]).factory('esService', [function () {
    var socket = io();
    return {
        subscribe: function (keyword) {
            socket.emit("subscribe", keyword);
            socket.on("response", function (msg) {
                alert(msg);
            });
        }

    };
}]);