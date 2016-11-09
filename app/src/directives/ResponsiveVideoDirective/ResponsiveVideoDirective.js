'use strict';
(function () {
  var app = angular.module('video-test');
  app.directive('responsiveVideo', ['$sce', '$timeout', function ($sce, $timeout) {
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
        scope.useNativeVideo = false;
        scope.showNativeVideo = false;
        scope.showOptions = false;
        scope.useHlsFallback = false;
        scope.showHlsFallback = false;
        scope.safeStreamingSrc = $sce.trustAsResourceUrl(scope.streamingSrc);
        scope.safeFallbackSrc = $sce.trustAsResourceUrl(scope.fallbackSrc);
        scope.loadVideo = function () {
          var canPlayHls = document.createElement('video').canPlayType('application/vnd.apple.mpegURL');
          console.log(canPlayHls);
          if (canPlayHls === '' && Hls.isSupported()) {
            scope.useHlsFallback = true;
            $timeout(function () {
              var video = outerDiv.getElementsByClassName('hls-fallback')[0];
              var hls = new Hls();
              hls.loadSource(scope.streamingSrc);
              hls.attachMedia(video);
              hls.on(Hls.Events.MANIFEST_PARSED, function() {
                scope.showHlsFallback = true;
                scope.$apply();
                video.play();
              });
            });
            return;
          }
          scope.useNativeVideo = true;
          $timeout(function () {
            var video = outerDiv.getElementsByClassName('native-video')[0];
            video.oncanplay = function () {
              scope.showNativeVideo = true;
              scope.$apply();
              video.play();
            }
          })
        }
        // video.oncanplay = function () {
        //   video.play();
        // };
      }
    }
  }])
})();
