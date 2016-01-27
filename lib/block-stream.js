var through2 = require('through2');
var util = require('util');
var asciitree = require('my-ascii-tree');
var PluginError = require('gulp-util').PluginError;
var LineBlock = require('./line-block');
var StreamLine = require('./stream-line');

module.exports = BlockStream;

function BlockStream(startTag, endTag) {
  var lines = [];
  var startTagReached = false;

  return through2.obj(function(buf, enc, cb) {
      var lineType = asciitree.LineUtil.lineType(startTag, endTag, buf);
      if (lineType === 'START') {
        startTagReached = true; // tagline discarded.
      } else if (lineType === 'END') {
        this.push(new LineBlock(lines));
        lines = [];
        startTagReached = false;
        return cb();
      } else {
        if (startTagReached) {
          lines.push(buf); //this branch doesn't call cb();
        } else {
          this.push(new LineBlock(buf));
          return cb();
        }
      }
      cb();
  }, function(cb) {
    if (lines.length > 0) {
      if (startTagReached) { //unmatching tag pair.
        for (var i = 0; i < lines.length; i++) {
          this.push(new BlockOrLine(false, lines[i]));
        }
        startTagReached = false;
      } else {
        this.push(new BlockOrLine(true, lines));
      }
      lines = [];
    }
    cb();
  });
}
