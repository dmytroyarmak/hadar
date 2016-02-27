(function() {
    'use strict';

    angular
        .module('hadar.common.services.fileReader', [])
        .factory('haFileReader', haFileReaderFactory);

    haFileReaderFactory.$inject = ['$q'];
    function haFileReaderFactory ($q) {
        var service = {
            readText: readText
        };

        return service;

        //////////

        function readText (file) {
            if (file) {
                return $q(function(resolve, reject) {
                    var fileReader = new FileReader();

                    fileReader.addEventListener('load', function() {
                        resolve(fileReader.result);
                    });

                    fileReader.addEventListener('error', function() {
                        reject('Failed to read the file');
                    });

                    fileReader.readAsText(file);
                });
            } else {
                return $q.reject('No file passed');
            }
        }
    }
}());
