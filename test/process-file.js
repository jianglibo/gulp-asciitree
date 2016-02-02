var chai = require('chai');
var through = require('through2');
var assert = require('assert');
var asciitree = require('my-ascii-tree');
var fs = require('fs');

var expect = chai.expect;

describe('ProcessFile', function() {
  it("should work.", function(done) {
    var src = fs.createReadStream('fixtures/tree.txt');
    var strArray = [];

    src.pipe(asciitree.stream.splitterStream())
      .pipe(asciitree.stream.blockStream("{% asciitree %}", "{% endasciitree %}"))
      .pipe(asciitree.stream.treeStream())
      .pipe(asciitree.stream.unwrapStream())
      .pipe(through.obj(function(buf, enc, cb){
        cb();
        strArray.push(buf.toString(Buffer.isEncoding(enc) ? enc : null));
      })).on('finish', function(){
        assert.equal(18, strArray.length);
        assert.equal('日本的天空下', strArray[10].trim());
        assert.equal('└── d', strArray[9].trim());
        done();
      });

  });
});
