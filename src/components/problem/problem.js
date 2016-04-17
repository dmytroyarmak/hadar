(function() {
    'use strict';

    angular
        .module('hadar.components.problem', [
            'ui.router',
            'hadar.common.services.solver'
        ])
        .config(problemConfig)
        .controller('HaProblemController', HaProblemController);

    problemConfig.$inject = ['$stateProvider'];
    function problemConfig ($stateProvider) {
        $stateProvider
            .state('problem', {
                abstract: true,
                url: '/problem',
                templateUrl: 'components/problem/problem.html',
                controller: 'HaProblemController',
                controllerAs: 'vm'
            });
    }

    HaProblemController.$inject = ['$log', '$state', 'haSolver'];
    function HaProblemController($log, $state, haSolver){
        var vm = this;
        vm.getSelectedTabIndex = getSelectedTabIndex;

        activate();

        //////////

        function activate() {
            haSolver.init();
        }

        function getSelectedTabIndex() {
            switch($state.$current.name) {
                case 'problem.input': return 0;
                case 'problem.progress': return 1;
                case 'problem.result': return 2;
                default: return NaN;
            }
        }
    }
}());
