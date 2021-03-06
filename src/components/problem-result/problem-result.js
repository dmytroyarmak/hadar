(function() {
    'use strict';

    angular
        .module('hadar.components.problemResult', [
            'ui.router',
            'chart.js',
            'hadar.common.services.solver'
        ])
        .config(problemResultConfig)
        .controller('HaProblemResultController', HaProblemResultController);

    problemResultConfig.$inject = ['$stateProvider'];
    function problemResultConfig ($stateProvider) {
        $stateProvider
            .state('problem.result', {
                url: '/result',
                templateUrl: 'components/problem-result/problem-result.html',
                controller: 'HaProblemResultController',
                controllerAs: 'vm'
            });
    }

    HaProblemResultController.$inject = ['$timeout', '$state', 'haSolver'];
    function HaProblemResultController($timeout, $state, haSolver){
        var vm = this;

        vm.downloadResult = downloadResult;
        vm.result = null;
        vm.solveMultipleTimes = false;
        vm.timeChartData = null;
        vm.timeChartLabels = null;

        activate();

        //////////

        function activate() {
            if (haSolver.hasCurrentProblem()) {
                $timeout(function() {
                    haSolver
                        .getCurrentProblem()
                        .resultsPromise.then(function onComputationDone (results) {
                            vm.result = results[0];
                            vm.solveMultipleTimes = (results.length > 1);
                            vm.timeChartData = _getTimeChartData(results);
                            vm.timeChartLabels = _getTimeChartLabels(results);
                        });
                }, 50);
            } else {
                $state.go('^.input');
            }
        }

        function downloadResult (result) {
            var downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
            downloadLink.setAttribute('download', 'result.txt');
            downloadLink.click();
        }

        function _getTimeChartData(results) {
            return [
                results.map(function(result) {
                    return result.time;
                })
            ];
        }

        function _getTimeChartLabels(results) {
            return results.map(function(result) {
                return result.usedProcesses
            });
        }
    }
}());
