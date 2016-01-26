var through2 = require('through2');

module.exports = LineStream;

function LineStream() {
  var byteArray = [];
  var crlnReached = false;

  return through2.obj(function(buf, enc, cb) {
    for (var i = 0; i < buf.length; i++) {
      if (buf[i] === 0x0D || buf[i] === 0x0A) {
        if (!crlnReached) {
          this.push(new Buffer(byteArray));
        }
        byteArray = [];
        crlnReached = true;
      } else {
        crlnReached = false;
        byteArray.push(buf[i]);
      }
    }
    cb();
  }, function(cb) {
    if (byteArray.length > 0) {
      this.push(byteArray);
    }
    byteArray = [];
    cb();
  });
}
