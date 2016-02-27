(function() {
    'use strict';

    angular
        .module('hadar.common.services.matrixReader', [
            'hadar.common.services.fileReader'
        ])
        .factory('haMatrixReader', haMatrixReaderFactory);

    haMatrixReaderFactory.$inject = ['haFileReader'];
    function haMatrixReaderFactory (haFileReader) {
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
            return haFileReader
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
}());
