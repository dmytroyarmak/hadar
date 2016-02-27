(function() {
    'use strict';

    angular
        .module('hadar.components.problemInput', [
            'ngMessages',
            'ui.router',
            'hadar.common.services.matrixReader',
            'hadar.common.directives.onFileChange'
        ])
        .config(problemInputConfig)
        .controller('HaProblemInputController', HaProblemInputController);

    problemInputConfig.$inject = ['$stateProvider'];
    function problemInputConfig ($stateProvider) {
        $stateProvider
            .state('problem.input', {
                url: '/input',
                templateUrl: 'components/problem-input/problem-input.html',
                controller: 'HaProblemInputController',
                controllerAs: 'vm'
            });
    }

    HaProblemInputController.$inject = ['$log', '$state', 'haMatrixReader'];
    function HaProblemInputController($log, $state, haMatrixReader){
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
        vm.solveProblem = solveProblem;

        //////////

        function onFileChange (fieldName, file) {
            if (file) {
                haMatrixReader
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

        function solveProblem () {
            if (vm.problemInputForm.$valid) {
                $state.go('^.progress');
            }
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
}());
