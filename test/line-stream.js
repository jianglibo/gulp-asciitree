var Readable = require('stream').Readable;
var fs = require('fs');
var chai = require('chai');
var through = require('through2');
var assert = require('assert');
var linestream = require('../line-stream');

var expect = chai.expect;
/**
because stream catch all errors, include assertion errors.
So I just pinrt it.
*/
function logmsg(expected, actual, name) {
  console.log((name || "value") + " should be " + expected + ". actual value is: " + actual);
}

describe('LineStream', function() {
  describe('#pipe()', function() {
    it('should handle short line.', function() {
      var count = 0;
      var values = [0x61, 0x62, 0x63];
      var rs = fs.createReadStream('fixtures/afile.txt')
        .pipe(linestream())
        .pipe(through.obj(function(buf, enc, cb) {
          logmsg(values[count++], buf[0], "line value");
          cb();
        }))
        .on('finish', function(cb) {
          logmsg(3, count, "lines");
        });
    });

    it('should handle long line.', function() {
      var count = 0;
      var rs = fs.createReadStream('fixtures/longline.txt')
        .pipe(linestream())
        .pipe(through.obj(function(buf, enc, cb) {
          count++;
          cb();
        }))
        .on('finish', function(cb) {
          logmsg(1, count, "lines");
        });
    });
  });
});
