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
        var video = outerDiv.getElementsByClassName('video-to-show')[0];
        scope.showVideo = false;
        scope.safeStreamingSrc = $sce.trustAsResourceUrl(scope.streamingSrc);
        scope.loadVideo = function () {
          var canPlayType = video.canPlayType;
          // if (video.canPlayType('application/vnd.apple.mpegURL') === 'probably') {
          //   scope.showVideo = true;
          //   return;
          // }
          if(Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(scope.streamingSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
              scope.showVideo = true
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
