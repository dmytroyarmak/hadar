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
        }

        function solveProblem(problem) {
            if (_getPlalibMethodName(problem)) {
                _currentProblem = problem;
                _currentProblem.resultsPromise = _getProcessesNumbersToUse(problem).reduce(function(resultsPromise, useProcesses) {
                    return resultsPromise.then(function(results) {
                        return _startSolving(problem, useProcesses).then(function(result) {
                            return results.concat(result);
                        });
                    });
                }, $q.resolve([]));
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
            } else if (problem.type === 'SOLVE_EIGENVALUE_PROBLEM'){
                switch (problem.method) {
                    case 'FULL_EIGENVALUE_DENSE_SYM': return 'solveFullEigenvalueDenseSymPar';
                }
            }
        }

        function _formatSolution(b) {
            return b.map(function(x) {
                return x.toFixed(9);
            }).join('\n');
        }

        function _startSolving(problem, useProcesses) {
            var a = _convertMatrixToSharedArray(problem.matrix);
            var b = (problem.type === 'SOLVE_LINEAR_SYSTEM') ? _convertMatrixToSharedArray(problem.vector) : _createEmptySharedArray();
            var n = problem.matrix.rows;
            var startTime = window.performance.now();

            return _getPlalibInstance()
                [_getPlalibMethodName(problem)](n, a, b, useProcesses)
                .then(function() {
                    var endTime = window.performance.now();
                    return {
                        usedProcesses: useProcesses,
                        solution: _formatSolution(b),
                        time: (endTime - startTime) / 1000
                    };
                });
        }

        function _getProcessesNumbersToUse(problem) {
            if (problem.demoMode) {
                return _.range(1, problem.processesCount + 1);
            } else {
                return [problem.processesCount];
            }
        }

        function _createEmptySharedArray() {
            var emptyBuffer = new SharedArrayBuffer(0);
            return new Float64Array(emptyBuffer);
        }
    }
}());
