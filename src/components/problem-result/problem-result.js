(function() {
    'use strict';

    angular
        .module('hadar.components.problemResult', [
            'ui.router',
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

    HaProblemResultController.$inject = ['$state', 'haSolver'];
    function HaProblemResultController($state, haSolver){
        var vm = this;

        vm.downloadResult = downloadResult;
        vm.results = null;

        activate();

        //////////

        function activate() {
            if (haSolver.hasCurrentProblem()) {
                haSolver
                    .getCurrentProblem()
                    .resultsPromise.then(function onComputationDone (results) {
                        vm.results = results;
                    });
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
    }
}());
