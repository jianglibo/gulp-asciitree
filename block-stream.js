var through2 = require('through2');
var util = require('util');
var asciitree = require('my-ascii-tree');

module.exports = BlockStream;

function BlockOrLine(isBlock, lineOrLines) {
  this.isBlock = isBlock;
  this.lines = lineOrLines;
}

function BlockStream(startTag, endTag) {
  var lines = [];
  var startTagReached = false;

  return through2.obj(function(buf, enc, cb) {
    var line;
    try {
      line = buf.toString();
    } catch (err) {
      // ignore error, startTag end endTag only contains ascii characters.
      this.push(new BlockOrLine(false, buf));
      return cb();
    }

    try {
      var lineType = asciitree.AsciiTrees.lineType(startTag, endTag, line);
      if (lineType === 'START') {
        this.startTagReached = true; // tagline discarded.
      } else if (lineType === 'END') {
        this.push(new BlockOrLine(true, lines));
        lines = [];
        startTagReached = false;
        return cb();
      } else {
        if (startTagReached) {
          lines.push(buf); //this branch doesn't call cb();
        } else {
          this.push(new BlockOrLine(false, buf));
          return cb();
        }
      }
    } catch (err) {
      console.log(util.inspect(err, { depth: 5 }));
    }

  }, function(cb) {
    if (lines.length > 0) {
      if (startTagReached) { //unmatching tag pair.
        for (var i = 0; i < lines.length; i++) {
          this.push(new BlockOrLine(false, lines[i]));
        }
      } else {
        this.push(new BlockOrLine(true, lines));
      }
      lines = [];
    }
    cb();
  });
}
