/* global angular */

'use strict';

angular.module('esApp.UploadController', [
    'esApp.service.ElasticSearch',
    'ng'
])
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
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
                    $.notify("no upload", "warning");

                });
        };
    }])
    .controller('UploadController', ['$scope', 'fileUpload', function ($scope, fileUpload) {
        $scope.uploadFile = function () {
            var file = $scope.uFile;
            var uploadUrl = '/document';
            console.log(file);

            function callback() {
                $.notify("upload successfull: " + file.name, "success");
                $scope.uFile.success = true;
            };
            fileUpload.uploadFileToUrl(file, uploadUrl, callback);

        };
    }]);
