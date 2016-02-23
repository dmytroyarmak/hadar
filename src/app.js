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
                label: 'Стрічкова матриця'
            }
        ];
        vm.matrixInputSource = 'FILE';
        vm.matrixSize = NaN;
        vm.vectorInputSource = 'FILE';
        vm.vectorSize = NaN;
        vm.maxProcessesCount = navigator.hardwareConcurrency;
        vm.processesCount = vm.maxProcessesCount;
        vm.showCalculationTime = true;
        vm.maxCalculationTime = 30;
    }
}());
