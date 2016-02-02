var chai = require('chai');
var through = require('through2');
var assert = require('assert');
var asciitree = require('my-ascii-tree');
var fs = require('fs');
var gulpAsciiTree = require('../index');
var vfs = require('vinyl-fs');

var expect = chai.expect;

describe('AsciiTreePlugin', function() {
  it("should handle buffer mode.", function(done) {
    vfs.src(['./fixtures/tree.txt'])
      .pipe(gulpAsciiTree("{% asciitree %}", "{% endasciitree %}"))
      .pipe(through.obj(function(file, enc, cb) {
        console.log(file.contents.toString());
        assert.equal(19, file.contents.toString().split(/[\r\n]+/).length); //because last empty line.
        cb();
      })).on('finish', function() {
        done();
      });
  });

  it("should handle stream mode.", function(done) {
    var strArray = [];
    vfs.src(['./fixtures/tree.txt'], {buffer: false})
      .pipe(gulpAsciiTree("{% asciitree %}", "{% endasciitree %}"))
      .pipe(through.obj(function(file, enc, cb) {
        assert(file.contents, "file.contents should not be null.");
        file.contents.pipe(through.obj(function(buf, enc, cb0) {
          strArray.push(buf.toString(Buffer.isEncoding(enc) ? enc : null));
          cb0();
        })).on('finish', function() {
          assert.equal(18, strArray.length);
          cb();
        });
      })).on('finish', function() {
        done();
      });
  });
});
