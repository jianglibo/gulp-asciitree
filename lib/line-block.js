module.exports = LineBlock;

function LineBlock(lines) {
  this.lines = lines;
}

LineBlock.prototype.isEmpty = function() {
  return this.lines.length === 0;
};
