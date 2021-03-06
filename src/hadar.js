(function() {
    'use strict';

    angular
        .module('hadar', [
            'ui.router',
            'ngMaterial',

            'hadar.common',
            'hadar.components'
        ])
        .config(hadarConfig);

    hadarConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
    function hadarConfig($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/problem/input');
    }
}());
