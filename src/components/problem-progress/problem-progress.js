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

        vm.progressIndicator = 0;
        vm.cancelProblem = cancelProblem;

        activate();

        //////////

        function activate() {
            vm.progressIntervalId = $interval(_onProgressTick, 300);
            $scope.$on('$destroy', _clearProgressInterval);
        }

        function cancelProblem () {
            $state.go('^.input');
        }

        function _onProgressTick () {
            vm.progressIndicator += 10;

            if (vm.progressIndicator >= 100) {
                $state.go('^.result');
            }
        }

        function _clearProgressInterval () {
            window.clearInterval(vm.progressIntervalId);
        }
    }
}());
