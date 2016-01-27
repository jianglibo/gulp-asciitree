var Readable = require('stream').Readable;
var fs = require('fs');
var chai = require('chai');
var through = require('through2');
var assert = require('assert');
var blockstream = require('../lib/block-stream');
var splitterStream = require('../lib/splitter-stream');
var logmsg = require('./logmsg');


var expect = chai.expect;
/**
because stream catch all errors, include assertion errors.
So I just pinrt it.
*/

process.on('uncaughtException', function(err) {
  console.log(err);
});

describe('BlockStream', function() {
  describe('#pipe()', function() {
    it('should handle notag file.', function() {
      var count = 0;
      var values = [0x61, 0x62, 0x63];
      var rs = fs.createReadStream('fixtures/afile.txt')
        .pipe(splitterStream())
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
      var isBlockCount = 0;
      var notBlockCount = 0;
      var rs = fs.createReadStream('fixtures/tagfile.txt')
        .pipe(splitterStream())
        .pipe(blockstream("xx", "yy"))
        .pipe(through.obj(function(buf, enc, cb) {
          count++;
          if (buf.isBlock) {
            isBlockCount++;
          } else {
            notBlockCount++;
          }
          cb();
        }))
        .on('error', function(err) {
          console.log(err);
        })
        .on('finish', function(cb) {
          logmsg(2, count, "blocks");
          logmsg(1, isBlockCount, "isBlockCount");
          logmsg(1, notBlockCount, "notBlockCount");
        });
    });

    it('should handle tag unclosed file.', function() {
      var count = 0;
      var isBlockCount = 0;
      var notBlockCount = 0;
      var rs = fs.createReadStream('fixtures/tagfileopen.txt')
        .pipe(splitterStream())
        .pipe(blockstream("xx", "yy"))
        .pipe(through.obj(function(buf, enc, cb) {
          count++;
          if (buf.isBlock) {
            isBlockCount++;
          } else {
            notBlockCount++;
          }
          cb();
        }))
        .on('error', function(err) {
          console.log(err);
        })
        .on('finish', function(cb) {
          logmsg(5, count, "blocks");
          logmsg(0, isBlockCount, "isBlockCount");
          logmsg(5, notBlockCount, "notBlockCount");
        });
    });
  });
});
