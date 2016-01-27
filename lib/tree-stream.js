var through2 = require('through2');
var util = require('util');
var asciitree = require('my-ascii-tree');
var PluginError = require('gulp-util').PluginError;

module.exports = TreeStream;

function TreeStream() {
  var lines = [];
  var startTagReached = false;

  return through2.obj(function(blockOrLine, enc, cb) {
    if (blockOrLine.isBlock) {
      var convertedLines = new asciitree.AsciiTree(blockOrLine.lines).convert();
      convertedLines.forEach(function(it) {
        this.push(it);
      }, this);
    } else {
      this.push(blockOrLine.lines);
    }
    cb();
  });
}
