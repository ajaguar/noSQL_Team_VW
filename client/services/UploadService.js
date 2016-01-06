/* global angular,$,FormData*/

'use strict';

angular.module('esApp.service.FileUpload', [
    'ng'
])
    .service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function (file, uploadUrl, cb) {
            var fd = new FormData();
            fd.append('document', file);
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function () {
                    cb();
                })
                .error(function () {
                    $.notify('no upload', 'warning');

                });
        };
    }]);
