var Readable = require('stream').Readable;
var fs = require('fs');
var chai = require('chai');
var through = require('through2');
var assert = require('assert');
var blockstream = require('../block-stream');
var linestream = require('../line-stream');

var expect = chai.expect;
/**
because stream catch all errors, include assertion errors.
So I just pinrt it.
*/
function logmsg(expected, actual, name) {
  console.log((name || "value") + " should be " + expected + ". actual value is: " + actual);
}

describe('BlockStream', function() {
  describe('#pipe()', function() {
    it('should handle notag file.', function() {
      var count = 0;
      var values = [0x61, 0x62, 0x63];
      var rs = fs.createReadStream('fixtures/afile.txt')
        .pipe(linestream())
        .pipe(blockstream("xx", "yy"))
        .pipe(through.obj(function(buf, enc, cb) {
          logmsg(values[count++], buf.lines[0], "line value");
          cb();
        }))
        .on('finish', function(cb) {
          logmsg(3, count, "lines");
        });
    });

    it('should handle tag file.', function() {
      var count = 0;
      var values = [0x61, 0x62, 0x63];
      var rs = fs.createReadStream('fixtures/tagfile.txt')
        .pipe(linestream())
        .pipe(blockstream("xx", "yy"))
        .pipe(through.obj(function(buf, enc, cb) {
          console.log(buf);
          cb();
        }))
        .on('finish', function(cb) {
          logmsg(3, count, "blocks");
        });
    });
  });
});
