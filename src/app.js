(function() {
    'use strict';

    angular
        .module('hadar', [
            'ngMessages'
        ])
        .controller('HadarController', HadarController);

    HadarController.$inject = [];
    function HadarController(){
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
        vm.matrixType = null;
        vm.availableMatrixTypes = [
            {
                value: 'DENSE',
                label: 'Щільна матриця'
            },
            {
                value: 'BAND',
                label: 'Розріджена матриця'
            }
        ];
        vm.matrixSymmetry = null;
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
        vm.matrixRows = NaN;
        vm.matrixColumns = NaN;
        vm.matrixValues = '';
        vm.vectorInputSource = 'FILE';
        vm.vectorRows = NaN;
        vm.matrixValues = '';
        vm.maxProcessesCount = navigator.hardwareConcurrency;
        vm.processesCount = vm.maxProcessesCount;
        vm.showCalculationTime = true;
        vm.maxCalculationTime = 30;
    }
}());
