'use strict';
var AWS = require('aws-sdk');
var pipelineId = '1478447144171-5wfhkh';

var s3 = new AWS.S3({
 apiVersion: '2012-09-25'
});

var et = new AWS.ElasticTranscoder({
 apiVersion: '2012-09-25',
 region: 'us-east-1'
});

var validVideoFormats = [
  'mp4',
  'flv',
  'ogg',
  'avi',
  'mov'
];

exports.handler = function (event, context) {
  var bucket = event.Records[0].s3.bucket.name;
  var key = event.Records[0].s3.object.key;
  if (bucket !== 'barabander-videos-test') {
    context.fail('Incorrect Video Input Bucket');
    return;
  }
  var srcKey = decodeURIComponent(key.replace(/\+/g, ' ')); //the object may have spaces
  var keySplitOnDots = key.split('.');
  var newKey = keySplitOnDots[0];
  var fileExtension = keySplitOnDots[keySplitOnDots.length - 1].trim().toLowerCase();

  if (validVideoFormats.indexOf(fileExtension) === -1) {
    context.fail('Not a valid video format');
    return;
  }

  var hls64kAudioPresetId = '1351620000001-200071';
  var hls0400kPresetId = '1351620000001-200050';
  var hls0600kPresetId = '1351620000001-200040';
  var hls1000kPresetId = '1351620000001-200030';
  var hls1500kPresetId = '1351620000001-200020';
  var hls2000kPresetId = '1351620000001-200010';
  var segmentDuration = '10';

  var hls64kAudio = {
    Key: 'hls64kAudio/' + newKey,
    PresetId: hls64kAudioPresetId,
    SegmentDuration: segmentDuration
  };
  var hls0400k = {
    Key: 'hls0400k/' + newKey,
    PresetId: hls0400kPresetId,
    SegmentDuration: segmentDuration
  };

  var hls0600k = {
    Key: 'hls0600k/' + newKey,
    PresetId: hls0600kPresetId,
    SegmentDuration: segmentDuration
  };

  var hls1000k = {
    Key: 'hls1000k/' + newKey,
    PresetId: hls1000kPresetId,
    SegmentDuration: segmentDuration
  };

  var hls1500k = {
    Key: 'hls1500k/' + newKey,
    PresetId: hls1500kPresetId,
    SegmentDuration: segmentDuration
  };

  var hls2000k = {
    Key: 'hls2000k/' + newKey,
    PresetId: hls2000kPresetId,
    SegmentDuration: segmentDuration,
    ThumbnailPattern: 'thumbs-' + newKey + '-{count}'
  };

  var outputs = [
    hls64kAudio,
    hls0400k,
    hls0600k,
    hls1000k,
    hls1500k,
    hls2000k
  ];

  var outputKeys = outputs.map(function (element) {
    return element.Key;
  });

  var params = {
    PipelineId: pipelineId,
    OutputKeyPrefix: newKey + '/',
    Input: {
      Key: srcKey,
      FrameRate: 'auto',
      Resolution: 'auto',
      AspectRatio: 'auto',
      Interlaced: 'auto',
      Container: 'auto'
    },
    Outputs: outputs,
    Playlists: [{
        Name : 'hls_' + newKey,
        Format : 'HLSv3',
        OutputKeys: outputKeys
    }]
  };
  et.createJob(params, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
    context.succeed('Job succesfully created');
  });
};
