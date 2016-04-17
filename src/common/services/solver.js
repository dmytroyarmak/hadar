(function() {
    'use strict';

    angular
        .module('hadar.common.services.solver', [])
        .factory('haSolver', haSolverFactory);

    haSolverFactory.$inject = ['$q'];
    function haSolverFactory ($q) {
        var _plalib;
        var _currentProblem;

        var service = {
            getCurrentProblem: getCurrentProblem,
            hasCurrentProblem: hasCurrentProblem,
            cancelCurrentProblem: cancelCurrentProblem,
            gaussJordanElimination: gaussJordanElimination
        };

        return service;

        //////////


        function getCurrentProblem() {
            return _currentProblem;
        }

        function hasCurrentProblem() {
            return !!_currentProblem;
        }

        function cancelCurrentProblem() {
            _currentProblem = null;
            // TODO: Implement problem canceling
            console.log('Cancel current problem');
        }

        function gaussJordanElimination(matrix, vector) {
            var a = _convertMatrixToSharedArray(matrix);
            var b = _convertMatrixToSharedArray(vector);
            var n = matrix.rows;
            var startTime = window.performance.now();
            _currentProblem = _getPlalibInstance()
                .gaussJordanEliminationPar(n, a, b)
                .then(function() {
                    var endTime = window.performance.now();
                    return {
                        solution: b.join('\n'),
                        time: (endTime - startTime) / 1000
                    };
                });
        }

        function _getPlalibInstance () {
            _plalib = _plalib || new Plalib({
                workerUrl: '../node_modules/plalib/dist/plalib-worker.js'
            });
            return _plalib;
        }

        function _convertMatrixToSharedArray(matrix) {
            var numberOfValues = matrix.rows * matrix.columns;
            var matrixBuffer = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfValues);
            var regularArray = matrix.values.trimRight().split('\n').map(function(row) {
                return parseInt(row, 10);
            });
            var matrixArray = new Float64Array(matrixBuffer);
            if (matrix.matrixType === 'DENSE') {
                for (var i = 0; i < regularArray.length; i += 1) {
                    matrixArray[i] = regularArray[_byColumnToByRowIndex(i, matrix.columns)];
                }
            } else {
                // TODO: Implement sparse matrix creation
                throw new Error('Sparse matrix is not ready to use');
            }
            return matrixArray;
        }

        function _byColumnToByRowIndex(i, n) {
            return (i % n) * n + Math.floor(i / n);
        }
    }
}());
