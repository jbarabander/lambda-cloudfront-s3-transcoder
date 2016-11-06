'use strict';
var AWS = require('aws-sdk');
var pipelineId = '1478447144171-5wfhkh';

var s3 = new AWS.S3({
 apiVersion: '2012–09–25'
});

var et = new AWS.ElasticTranscoder({
 apiVersion: '2012–09–25',
 region: 'us-east-1'
});

var validVideoFormats = [
  'mp4',
  'flv'
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
    Outputs: [{
      Key: 'hls-' + newKey,
      ThumbnailPattern: 'thumbs-' + newKey + '-{count}',
      PresetId: '1351620000001–200010'
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
