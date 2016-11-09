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
        var outerDiv = element.children()[0];
        scope.showVideo = false;
        scope.showOptions = false;
        scope.safeStreamingSrc = $sce.trustAsResourceUrl(scope.streamingSrc);
        scope.safeFallbackSrc = $sce.trustAsResourceUrl(scope.fallbackSrc);
        scope.useFallbackSrc = !Hls.isSupported() && video.currentSrc === '';
        scope.loadVideo = function () {
          scope.showOptions = true;
          var video = outerDiv.getElementsByClassName('video-to-show')[0];
          if (video.currentSrc === scope.streamingSrc) {
            scope.showVideo = true;
            video.play();
            return;
          }
          if(Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(scope.streamingSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
              scope.showVideo = true;
              scope.$apply();
              video.play();
            });
          }
        }
        // video.oncanplay = function () {
        //   video.play();
        // };
      }
    }
  }])
})();
