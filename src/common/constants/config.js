(function() {
    'use strict';

    angular
        .module('hadar.common.constants.config', [])
        .factory('haConfig', haConfigFactory);

    haConfigFactory.$inject = [];
    function haConfigFactory () {

        var AVAILABLE_PROBLEM_TYPES = [
            {
                value: 'SOLVE_LINEAR_SYSTEM',
                label: 'Розв\'язання СЛАР'
            },
            {
                value: 'SOLVE_EIGENVALUE_PROBLEM',
                label: 'Розв\'язання АПВЗ'
            }
        ];

        var AVAILABLE_METHODS = {
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

        var AVAILABLE_INPUT_SOURCES = [
            {
                value: 'FILE',
                label: 'Файл'
            },
            {
                value: 'KEYBOARD',
                label: 'Клавіатура'
            }
        ];

        var AVAILABLE_MATRIX_TYPES = [
            {
                value: 'DENSE',
                label: 'Щільна матриця'
            },
            {
                value: 'SPARSE',
                label: 'Розріджена матриця'
            }
        ];

        var AVAILABLE_VALUES_TYPES = [
            {
                value: 'REAL',
                label: 'Дійсні'
            },
            {
                value: 'INTEGER',
                label: 'Цілі'
            }
        ];

        var AVAILABLE_SYMMETRY = [
            {
                value: 'GENERAL',
                label: 'Загального виду'
            },
            {
                value: 'SYMMETRIC',
                label: 'Симетрична'
            }
        ];

        return {
            AVAILABLE_PROBLEM_TYPES: AVAILABLE_PROBLEM_TYPES,
            AVAILABLE_METHODS: AVAILABLE_METHODS,
            AVAILABLE_INPUT_SOURCES: AVAILABLE_INPUT_SOURCES,
            AVAILABLE_MATRIX_TYPES: AVAILABLE_MATRIX_TYPES,
            AVAILABLE_VALUES_TYPES: AVAILABLE_VALUES_TYPES,
            AVAILABLE_SYMMETRY: AVAILABLE_SYMMETRY
        };
    }
}());
