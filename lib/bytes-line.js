
module.exports = BytesLine;


function BytesLine(bytes, separator) {
  this.bytes = bytes;
  this.separator = separator;
}

BytesLine.prototype.isEmpty = function() {
  return this.bytes.length === 0 && this.separator.length === 0;
};

BytesLine.prototype.toBuffer = function() {
  return new Buffer(this.bytes.concat(this.separator));
};
