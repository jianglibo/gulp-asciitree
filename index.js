var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var asciitree = require('my-ascii-tree');

var PLUGIN_NAME = 'gulp-asciitree';

module.exports = function(startTag, endTag, prepend, append) {
  if (!startTag || !endTag) {
    throw new PluginError(PLUGIN_NAME, 'Missing startTag or endTag!');
  }
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
      // nothing to do
      return callback(null, file);
    }

    if (file.isStream()) {
      // file.contents is a Stream - https://nodejs.org/api/stream.html
      // this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
      file.contents = file.contents
        .pipe(asciitree.stream.splitterStream())
        .pipe(asciitree.stream.blockStream(startTag, endTag))
        .pipe(asciitree.stream.treeStream())
        .pipe(asciitree.stream.unwrapStream());
      // or, if you can handle Streams:
      //file.contents = file.contents.pipe(...
      return callback(null, file);
    } else if (file.isBuffer()) {
      // file.contents is a Buffer - https://nodejs.org/api/buffer.html
      // this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));

      var convertorBuilder = new asciitree.ConvertorBuilder()
        .withContent(file.contents)
        .withStartTag(startTag)
        .withEndTag(endTag)
        .withPrepend(prepend)
        .withAppend(append);

      file.contents = convertorBuilder.build().convert().toBuffer();
      // or, if you can handle Buffers:
      //file.contents = ...
      return callback(null, file);
    }
  });
};
