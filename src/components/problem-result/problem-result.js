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

        vm.downloadResult = downloadResult;
        vm.calculationTime = +(2 + 5 * Math.random()).toFixed(2);
        vm.result = _.range(8).map(function(x) {
            return (Math.random() * Math.pow(10, _.random(-3, 3))).toExponential(10);
        }).join('\n');

        //////////

        function downloadResult () {
            var downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(vm.result));
            downloadLink.setAttribute('download', 'result.txt');
            downloadLink.click();
        }
    }
}());
