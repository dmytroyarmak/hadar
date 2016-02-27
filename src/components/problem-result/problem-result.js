(function() {
    'use strict';

    angular
        .module('hadar.components.problemResult', [
            'ui.router'
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

    HaProblemResultController.$inject = [];
    function HaProblemResultController(){
        var vm = this;
    }
}());
