(function() {
    'use strict';

    angular
        .module('hadar.components.problemProgress', [
            'ui.router'
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

    HaProblemProgressController.$inject = ['$state', '$scope', '$interval'];
    function HaProblemProgressController($state, $scope, $interval){
        var vm = this;

        vm.onComputationDone = onComputationDone;
        vm.cancelProblem = cancelProblem;

        //////////

        function cancelProblem () {
            $state.go('^.input');
        }

        function onComputationDone () {
            $state.go('^.result');
        }
    }
}());
