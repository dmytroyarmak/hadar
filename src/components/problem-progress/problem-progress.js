(function() {
    'use strict';

    angular
        .module('hadar.components.problemProgress', [
            'ui.router',
            'hadar.common.services.solver'
        ])
        .config(problemProgressConfig)
        .controller('HaProblemProgressController', HaProblemProgressController);

    problemProgressConfig.$inject = ['$stateProvider'];
    function problemProgressConfig ($stateProvider) {
        $stateProvider
            .state('problem.progress', {
                url: '/progress',
                templateUrl: 'components/problem-progress/problem-progress.html',
                controller: 'HaProblemProgressController',
                controllerAs: 'vm'
            });
    }

    HaProblemProgressController.$inject = ['$state', '$log', 'haSolver'];
    function HaProblemProgressController($state, $log, haSolver){
        var vm = this;

        vm.cancelProblem = cancelProblem;

        activate();

        //////////

        function activate() {
            if (haSolver.hasCurrentProblem()) {
                haSolver
                    .getCurrentProblem()
                    .resultPromise.then(function onComputationDone () {
                        $state.go('^.result');
                    }, function onComputationFailed(error) {
                        $log.error('Problem computation failed', error);
                    });
            } else {
                $state.go('^.input');
            }
        }

        function cancelProblem () {
            haSolver.cancelCurrentProblem();
            $state.go('^.input');
        }
    }
}());
