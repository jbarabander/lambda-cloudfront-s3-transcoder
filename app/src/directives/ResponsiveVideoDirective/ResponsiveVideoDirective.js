'use strict';
(function () {
  var app = angular.module('video-test');
  app.directive('responsiveVideo', ['$sce', function ($sce) {
    return {
      restrict: 'E',
      scope: {
        thumbnail: '@',
        streamingSrc: '@',
        fallbackSrc: '@',
        height: '@',
        width: '@'
      },
      templateUrl: 'directives/ResponsiveVideoDirective/ResponsiveVideoDirective.html',
      link: function (scope, element, attr) {
        scope.showVideo = false;
        var outerDiv = element.children()[0];
        var video = outerDiv.getElementsByClassName('video-to-show')[0];
        video.oncanplay = function () {
          video.play();
        };
        scope.safeStreamingSrc = $sce.trustAsResourceUrl(scope.streamingSrc);
      }
    }
  }])
})();
