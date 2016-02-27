(function() {
    'use strict';

    angular
        .module('hadar', [
            'ui.router',
            'hadar.common',
            'hadar.components'
        ])
        .config(hadarConfig);

    hadarConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
    function hadarConfig($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/problem/input');

        $stateProvider
            .state('problem', {
                abstract: true,
                url: '/problem',
                template: '<ui-view></ui-view>'
            });
    }
}());
