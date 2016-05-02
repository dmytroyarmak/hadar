(function() {
    'use strict';

    angular
        .module('hadar.components.problemInput', [
            'ngMessages',
            'ui.router',
            'hadar.common.services.matrixReader',
            'hadar.common.services.solver',
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

    HaProblemInputController.$inject = ['$log', '$state', 'haMatrixReader', 'haSolver'];
    function HaProblemInputController($log, $state, haMatrixReader, haSolver){
        var SWITCH_TO_EIGENVALUE = false;
        var DEFAULT_MAX_CALCULATION_TIME = 30;

        var vm = this;

        vm.availableProblemTypes = [
            {
                value: 'SOLVE_LINEAR_SYSTEM',
                label: 'Розв\'язання СЛАР'
            },
            {
                value: 'SOLVE_EIGENVALUE_PROBLEM',
                label: 'Розв\'язання АПВЗ'
            }
        ];

        vm.availableMethods = {
            SOLVE_LINEAR_SYSTEM: [
                {
                    value: 'GAUSS',
                    label: 'Метод Гауса'
                },
                {
                    value: 'CHOLESKY',
                    label: 'Метод Холецького'
                }
            ],
            SOLVE_EIGENVALUE_PROBLEM: [
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
            ]
        };

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
        vm.matrixInputSource = vm.availableInputSources[0].value;
        vm.vectorInputSource = vm.availableInputSources[0].value;
        vm.maxProcessesCount = navigator.oscpu === 'Intel Mac OS X 10.11' ? navigator.hardwareConcurrency / 2 : navigator.hardwareConcurrency;
        vm.problem = null;
        vm.onFileChange = onFileChange;
        vm.onSelectFileInputType = onSelectFileInputType;
        vm.solveProblem = solveProblem;
        vm.isSubmitButtonDisabled = isSubmitButtonDisabled;
        vm.resetForm = resetForm;

        activate();

        //////////

        function activate() {
            if (haSolver.hasCurrentProblem()) {
                vm.problem = haSolver.getCurrentProblem();
            } else {
                vm.problem = _createEmptyProblem();
            }
        }

        function onFileChange (fieldName, file) {
            if (file) {
                haMatrixReader
                    .read(file)
                    .then(function onReadMatrixSuccess(matrix) {
                        vm.problem[fieldName] = matrix;
                    }, function onReadMatrixError (error) {
                        $log.error(error);
                    });
            } else {
                vm.problem[fieldName] = _createEmptyMatrix();
            }
        }

        function onSelectFileInputType (fieldName) {
            vm.problem[fieldName] = _createEmptyMatrix();
        }

        function isSubmitButtonDisabled () {
            return !vm.problemInputForm || vm.problemInputForm.$invalid || !vm.problem.matrix.values || (vm.problem.type === 'SOLVE_LINEAR_SYSTEM' && !vm.problem.vector.values);
        }

        function solveProblem () {
            if (vm.problemInputForm.$valid) {
                haSolver.solveProblem(vm.problem);
                $state.go('^.progress');
            }
        }

        function resetForm() {
            vm.problem = _createEmptyProblem(vm.problem.type);
            vm.matrixInputSource = vm.availableInputSources[0].value;
            vm.vectorInputSource = vm.availableInputSources[0].value;
            vm.problemInputForm.$setPristine();
            vm.problemInputForm.problemType.$setDirty();
        }

        function _createEmptyProblem(initialType) {
            return {
                type: initialType,
                method: null,
                matrix: _createEmptyMatrix(),
                vector: _createEmptyMatrix(),
                processesCount: vm.maxProcessesCount,
                showCalculationTime: true,
                maxCalculationTime: DEFAULT_MAX_CALCULATION_TIME,
                demoMode: true
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
