(function() {
    'use strict';

    angular
        .module('hadar.components.problem', [
            'ui.router'
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

    HaProblemController.$inject = ['$log', '$state', 'haMatrixReader'];
    function HaProblemController($log, $state, haMatrixReader){
        var vm = this;
    }
}());
