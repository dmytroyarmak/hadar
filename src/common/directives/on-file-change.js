(function() {
    'use strict';

    angular
        .module('hadar.common.directives.onFileChange', [])
        .controller('DyOnFileChangeController', DyOnFileChangeController)
        .directive('dyOnFileChange', dyOnFileChangeDirective);

    dyOnFileChangeDirective.$inject = [];
    function dyOnFileChangeDirective () {
        return {
            restrict: 'A',
            controller: 'DyOnFileChangeController'
        };
    }

    DyOnFileChangeController.$inject = ['$element', '$scope', '$attrs'];
    function DyOnFileChangeController ($element, $scope, $attrs) {
        if ($element[0].tagName === 'INPUT' && $element[0].type === 'file') {
            $element.on('change', function(event) {
                $scope.$eval($attrs.dyOnFileChange, {$file: event.target.files[0]});
            });
        }
    }
}());
