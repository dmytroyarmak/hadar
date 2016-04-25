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
            init: init,
            getCurrentProblem: getCurrentProblem,
            hasCurrentProblem: hasCurrentProblem,
            cancelCurrentProblem: cancelCurrentProblem,
            solveProblem: solveProblem
        };

        return service;

        //////////

        function init() {
            _getPlalibInstance();
        }


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

        function solveProblem(problem) {
            var plalibMethodName = _getPlalibMethodName(problem);
            if (plalibMethodName) {
                console.log('Run plalibMethodName');
                var a = _convertMatrixToSharedArray(problem.matrix);
                var b = _convertMatrixToSharedArray(problem.vector);
                var n = problem.matrix.rows;
                var startTime = window.performance.now();
                _currentProblem = problem;
                _currentProblem.resultPromise = _getPlalibInstance()
                    [plalibMethodName](n, a, b, problem.processesCount)
                    .then(function() {
                        console.log('Done', a, b);
                        var endTime = window.performance.now();
                        return {
                            solution: b.join('\n'),
                            time: (endTime - startTime) / 1000
                        };
                    });
            } else {
                throw new Error('Current problem type and method has not been implemented yet!');
            }
        }

        function _getPlalibInstance () {
            _plalib = _plalib || new Plalib({
                workerUrl: '../node_modules/plalib/dist/plalib-worker.js',
                workersAmount: navigator.hardwareConcurrency
            });
            return _plalib;
        }

        function _convertMatrixToSharedArray(matrix) {
            switch(matrix.matrixType) {
                case 'DENSE': return _convertDenseMatrixToSharedArray(matrix);
                case 'SPARSE': return _convertSparseMatrixToSharedArray(matrix);
                default: throw new Error('Unsupported matrix type');
            }
        }

        function _convertSparseMatrixToSharedArray(matrix) {
            var numberOfValues = matrix.rows * matrix.columns;
            var matrixBuffer = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfValues);
            var matrixArray = new Float64Array(matrixBuffer);
            matrix.values.trimRight().split('\n').map(function(row) {
                return row.split(' ').map(function(value) {
                    return parseFloat(value);
                });
            }).forEach(function(valueRow) {
                var i = valueRow[0] - 1;
                var j = valueRow[1] - 1;
                var value = valueRow[2];
                matrixArray[i * matrix.columns + j] = value;
            });

            return matrixArray;
        }

        function _convertDenseMatrixToSharedArray(matrix) {
            var numberOfValues = matrix.rows * matrix.columns;
            var matrixBuffer = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfValues);
            var matrixArray = new Float64Array(matrixBuffer);
            var regularArray = matrix.values.trimRight().split('\n').map(function(row) {
                return parseFloat(row);
            });
            for (var i = 0; i < regularArray.length; i += 1) {
                matrixArray[i] = regularArray[_byColumnToByRowIndex(i, matrix.columns)];
            }

            return matrixArray;
        }

        function _byColumnToByRowIndex(i, n) {
            return (i % n) * n + Math.floor(i / n);
        }

        function _getPlalibMethodName(problem) {
            if (problem.type === 'SOLVE_LINEAR_SYSTEM') {
                switch (problem.method) {
                    case 'GAUSS': return 'gaussJordanEliminationPar';
                    case 'CHOLESKY': return 'solveLineraEquationByCholetskyPar';
                }
            }
        }
    }
}());
