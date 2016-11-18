'use strict';
(function () {
  var app = angular.module('video-test');
  app.directive('responsiveVideo', ['$sce', '$timeout', function ($sce, $timeout) {
    return {
      restrict: 'E',
      scope: {
        thumbnail: '@',
        streamingSrc: '@',
        fallbacks: '=',
        height: '@',
        width: '@'
      },
      templateUrl: 'directives/ResponsiveVideoDirective/ResponsiveVideoDirective.html',
      link: function (scope, element, attr) {
        var outerDiv = element.children()[0];
        var videoElement = document.getElementsByClassName('video-to-play')[0];
        videoElement.setAttribute("controls","controls");
        videoElement.setAttribute("height", "270");
        videoElement.setAttribute("width", "480");
        console.log(scope.fallbacks);
        if (Array.isArray(scope.fallbacks)) {
          scope.fallbacks.forEach(function (uri) {
            var alternateSource = createSourceElement(uri);
            videoElement.appendChild(alternateSource);
          })
        }
      }
    }
  }])

  function createSourceElement (src) {
    var source = document.createElement('source');
    source.setAttribute('src', src);
    return source;
  }
})();
