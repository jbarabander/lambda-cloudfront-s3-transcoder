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
        var videoElement = document.getElementsByClassName('video-to-play')[0];
        videoElement.setAttribute("controls","controls");
        videoElement.setAttribute("height", "270");
        videoElement.setAttribute("width", "480");
        var canPlayHls = videoElement.canPlayType('application/vnd.apple.mpegURL');
        if (canPlayHls === '' && Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(scope.streamingSrc);
          hls.attachMedia(videoElement);
        } else {
          var source = document.createElement('source');
          source.setAttribute('src', scope.streamingSrc);
          videoElement.appendChild(source);
          if (scope.fallbackSrc) {
            var alternateSource = document.createElement('source');
            alternateSource.setAttribute('src', scope.fallbackSrc);
            videoElement.appendChild(alternateSource);
          }
        }
      }
    }
  }])
})();
