/* global angular,$ */

'use strict';

angular.module('esApp.UploadController', [
    'esApp.service.ElasticSearch',
    'esApp.service.FileUpload',
    'esApp.directive.Upload',
    'ng'
])
    .controller('UploadController', ['$scope', 'fileUpload', function ($scope, fileUpload) {
        $scope.uploadFile = function () {
            var file = $scope.uFile;
            var uploadUrl = '/document';

            function callback() {
                $.notify('upload successfull: ' + file.name, 'success');
                $scope.uFile.success = true;
            }
            fileUpload.uploadFileToUrl(file, uploadUrl, callback);

        };
    }]);
