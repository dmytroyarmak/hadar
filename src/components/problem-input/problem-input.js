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
        var SWITCH_TO_EIGENVALUE = true;

        var vm = this;

        vm.problem = null;

        if (SWITCH_TO_EIGENVALUE) {
            vm.availableProblems = [
                {
                    value: 'FULL_EIGENVALUE_3_DIAG_SIM',
                    label: 'Повна стандартна АПВЗ з трьохдіагональною симетричною матрицею'
                },
                {
                    value: 'FULL_EIGENVALUE_DENSE_SYM',
                    label: 'Повна стандартна АПВЗ з щільною симетричною матрицею'
                },
                {
                    value: 'PARTIAL_EIGENVALUE_SYM_POS_DEF',
                    label: 'Часткова стандартна АПВЗ з симетричною додатньовизначеною матрицею'
                }
            ];
            vm.availableMethods = [];
        } else {
            vm.availableProblems = [
                {
                    value: 'SOLVE_LINEAR_SYSTEM',
                    label: 'Розв\'язання СЛАР'
                }
            ];
            vm.availableMethods = [
                {
                    value: 'AUTO',
                    label: 'Обрати автоматично'
                },
                {
                    value: 'GAUSS',
                    label: 'Метод Гауса'
                },
                {
                    value: 'CHOLESKY',
                    label: 'Метод Холецького'
                }
            ];
        }

        vm.method = null;
        vm.availableInputSources = [
            {
                value: 'FILE',
                label: 'Файл'
            },
            {
                value: 'KEYBOARD',
                label: 'Клавіатура'
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
        vm.availableSymmetry = [
            {
                value: 'GENERAL',
                label: 'Загального виду'
            },
            {
                value: 'SYMMETRIC',
                label: 'Симетрична'
            }
        ];
        vm.matrixInputSource = null;
        vm.vectorInputSource = null;
        vm.matrix = _createEmptyMatrix();
        vm.vector = _createEmptyMatrix();
        vm.maxProcessesCount = navigator.hardwareConcurrency;
        vm.processesCount = vm.maxProcessesCount;
        vm.showCalculationTime = true;
        vm.maxCalculationTime = 30;
        vm.onFileChange = onFileChange;
        vm.onSelectFileInputType = onSelectFileInputType;
        vm.solveProblem = solveProblem;
        vm.isSubmitButtonDisabled = isSubmitButtonDisabled;

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

        function isSubmitButtonDisabled () {
            return vm.problemInputForm.$invalid || !vm.matrix.values || (vm.problem === 'SOLVE_LINEAR_SYSTEM' && !vm.vector.values);
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
