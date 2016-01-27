var through = require('through2');
var linestream = require('./lib/line-stream');
var blockstream = require('./lib/block-stream');
var treeConvertStream = require('./lib/tree-convert-stream');

var PLUGIN_NAME = 'gulp-asciitree';

module.exports = function(opts) {
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
      // nothing to do
      return callback(null, file);
    }

    if (file.isStream()) {
      // file.contents is a Stream - https://nodejs.org/api/stream.html
      // this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
      file.contents = file.contents.pipe(linestream()).pipe(blockstream()).pipe(treeConvertStream());
      // or, if you can handle Streams:
      //file.contents = file.contents.pipe(...
      //return callback(null, file);
    } else if (file.isBuffer()) {
      // file.contents is a Buffer - https://nodejs.org/api/buffer.html
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));

      // or, if you can handle Buffers:
      //file.contents = ...
      //return callback(null, file);
    }
  });
};
