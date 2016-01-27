var Readable = require('stream').Readable;
var fs = require('fs');
var chai = require('chai');
var through = require('through2');
var assert = require('assert');
var splitterStream = require('../lib/splitter-stream');
var logmsg = require('./logmsg');

var expect = chai.expect;
/**
because stream catch all errors, include assertion errors.
So I just pinrt it.
*/
describe('LineStream', function() {
  describe('#pipe()', function() {
    it('should handle short line.', function() {
      var count = 0;
      var values = [0x61, 0x62, 0x63];
      var rs = fs.createReadStream('fixtures/afile.txt')
        .pipe(splitterStream())
        .pipe(through.obj(function(sl, enc, cb) {
          logmsg(values[count++], sl.bytes[0], "line value");
          cb();
        }))
        .on('finish', function(cb) {
          logmsg(3, count, "lines");
        });
    });

    it('should handle long line.', function() {
      var count = 0;
      var rs = fs.createReadStream('fixtures/longline.txt')
        .pipe(splitterStream())
        .pipe(through.obj(function(sl, enc, cb) {
          count++;
          cb();
        }))
        .on('finish', function() {
          logmsg(1, count, "lines");
        });
    });
  });
});
