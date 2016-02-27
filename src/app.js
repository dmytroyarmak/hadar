(function() {
    'use strict';

    angular
        .module('hadar', [
            'ngMessages'
        ])
        .factory('fileReader', fileReaderFactory)
        .factory('matrixReader', matrixReaderFactory)
        .controller('HadarController', HadarController)
        .controller('DyOnFileChangeController', DyOnFileChangeController)
        .directive('dyOnFileChange', dyOnFileChangeDirective);

    fileReaderFactory.$inject = ['$q'];
    function fileReaderFactory ($q) {
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

    matrixReaderFactory.$inject = ['fileReader'];
    function matrixReaderFactory (fileReader) {
        var COMMENT_LINE_INDICATOR = '%';
        var HEADER_REGEX = /^%%MatrixMarket matrix (\w+) (\w+) (\w+)$/;
        var DENSE_META_REGEX = /^\s*(\d+)\s+(\d+)$/;
        var SPARSE_META_REGEX = /^\s*(\d+)\s+(\d+)\s+(\d+)$/;

        var MATRIX_TYPE_TO_META_REGEX_MAP = {
            SPARSE: SPARSE_META_REGEX,
            DENSE: DENSE_META_REGEX
        };

        var service = {
            read: read
        };

        return service;

        //////////

        function read (file) {
            return fileReader
                .readText(file)
                .then(_parseMatrixMarketFile);
        }

        function _parseMatrixMarketFile (text) {
            var lines = text.split('\n');
            var headerLine = lines[0];
            var bodyLines = lines.slice(1).filter(_isNotCommentLine);
            var metaLine = bodyLines[0];
            var valueLines = bodyLines.slice(1);

            var headerLineMatchResult = headerLine.match(HEADER_REGEX);
            if (!headerLineMatchResult) {
                throw new Error('Can\'t parse header line: ' + headerLine);
            }


            var matrixType = _getMatrixTypeFromHeaderLineMatchResult(headerLineMatchResult);
            var valuesType = _getValueTypeFromHeaderLineMatchResult(headerLineMatchResult);
            var symmetry = _getSymmetryFromHeaderLineMatchResult(headerLineMatchResult);

            var metaLineMatchResult = metaLine.match(MATRIX_TYPE_TO_META_REGEX_MAP[matrixType]);
            if (!metaLineMatchResult) {
                throw new Error('Can\'t parse meta line: ' + metaLine);
            }

            var rows = parseInt(metaLineMatchResult[1], 10);
            var columns = parseInt(metaLineMatchResult[1], 10);
            var entities = parseInt(metaLineMatchResult[2], 10);
            var values = valueLines.join('\n');

            return {
                matrixType: matrixType,
                valuesType: valuesType,
                symmetry: symmetry,
                rows: rows,
                columns: columns,
                entities: entities,
                values: values
            };
        }

        function _isNotCommentLine (line) {
            return line[0] !== COMMENT_LINE_INDICATOR;
        }

        function _getMatrixTypeFromHeaderLineMatchResult (headerLineMatchResult) {
            var inputType = headerLineMatchResult[1];
            switch(inputType) {
                case 'coordinate': return 'SPARSE';
                case 'array': return 'DENSE';
                default: throw new Error('Unsopported input type: ' + inputType);
            }
        }

        function _getValueTypeFromHeaderLineMatchResult (headerLineMatchResult) {
            var valueType = headerLineMatchResult[2];
            switch(valueType) {
                case 'real': return 'REAL';
                case 'integer': return 'INTEGER';
                default: throw new Error('Unsopported value type: ' + valueType);
            }
        }

        function _getSymmetryFromHeaderLineMatchResult (headerLineMatchResult) {
            var symmetry = headerLineMatchResult[3];
            switch(symmetry) {
                case 'general': return 'GENERAL';
                case 'symmetric': return 'SYMMETRIC';
                default: throw new Error('Unsopported symmetry: ' + symmetry);
            }
        }
    }

    HadarController.$inject = ['$log', 'matrixReader'];
    function HadarController($log, matrixReader){
        var vm = this;

        vm.method = null;
        vm.availableMethods = [
            {
                value: 'GAUSS',
                label: 'Метод Гауса'
            },
            {
                value: 'CHOLESKY',
                label: 'Метод Холецького'
            }
        ];
        vm.availableMatrixTypes = [
            {
                value: 'DENSE',
                label: 'Щільна матриця'
            },
            {
                value: 'SPARSE',
                label: 'Розріджена матриця'
            }
        ];
        vm.availableValuesTypes = [
            {
                value: 'REAL',
                label: 'Дійсні'
            },
            {
                value: 'INTEGER',
                label: 'Цілі'
            }
        ];
        vm.availableMatrixSymmetry = [
            {
                value: 'GENERAL',
                label: 'Загального виду'
            },
            {
                value: 'SYMMETRIC',
                label: 'Симетрична'
            }
        ];
        vm.matrixInputSource = 'FILE';
        vm.vectorInputSource = 'FILE';
        vm.matrix = _createEmptyMatrix();
        vm.vector = _createEmptyMatrix();
        vm.maxProcessesCount = navigator.hardwareConcurrency;
        vm.processesCount = vm.maxProcessesCount;
        vm.showCalculationTime = true;
        vm.maxCalculationTime = 30;
        vm.onFileChange = onFileChange;
        vm.onSelectFileInputType = onSelectFileInputType;

        //////////

        function onFileChange (fieldName, file) {
            if (file) {
                matrixReader
                    .read(file)
                    .then(function onReadMatrixSuccess(matrix) {
                        vm[fieldName] = matrix;
                    }, function onReadMatrixError (error) {
                        $log.error(error);
                    });
            } else {
                vm[fieldName] = _createEmptyMatrix();
            }
        }

        function onSelectFileInputType (fieldName) {
            vm[fieldName] = _createEmptyMatrix();
        }

        function _createEmptyMatrix () {
            return {
                matrixType: null,
                valuesType: null,
                symmetry: null,
                rows: null,
                columns: null,
                entities: null,
                values: null
            };
        }
    }

    dyOnFileChangeDirective.$inject = [];
    function dyOnFileChangeDirective () {
        return {
            restrict: 'A',
            controller: 'DyOnFileChangeController'
        };
    }

    DyOnFileChangeController.$inject = ['$element', '$scope', '$attrs'];
    function DyOnFileChangeController ($element, $scope, $attrs) {
        if ($element[0].tagName === 'INPUT' && $element[0].type === 'file') {
            $element.on('change', function(event) {
                $scope.$eval($attrs.dyOnFileChange, {$file: event.target.files[0]});
            });
        }
    }
}());
