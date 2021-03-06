# gulp-asciitree
convert indented line block to an ascii directory tree

## usage

```
var chai = require('chai');
var through = require('through2');
var assert = require('assert');
var asciitree = require('my-ascii-tree');
var fs = require('fs');
var gulpAsciiTree = require('../index');
var vfs = require('vinyl-fs');

describe('AsciiTreePlugin', function() {
  it("should handle buffer mode.", function(done) {
    vfs.src(['./fixtures/tree.txt'])
      .pipe(gulpAsciiTree("{% asciitree %}", "{% endasciitree %}"))
      .pipe(through.obj(function(file, enc, cb) {
        assert.equal(16, file.contents.toString().split(/[\r\n]+/).length); //because last empty line.
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
          assert.equal(15, strArray.length);
          cb();
        });
      })).on('finish', function() {
        done();
      });
  });
});
```

in:

```
abc
uuu
{% asciitree %}
剧情片
-日本的天空下
-朗读者
-北方的金丝雀
-惹人嫌的松子的一生
--bb
c
-d
{% endasciitree %}
日本的天空下
aa
{% asciitree %}
我
-你把
--他的是
ok
-yes
--right
{% endasciitree %}

```

out:

```
abc
uuu
├── 剧情片
|   ├── 日本的天空下
|   ├── 朗读者
|   ├── 北方的金丝雀
|   └── 惹人嫌的松子的一生
|       └── bb
└── c
    └── d
日本的天空下
aa
├── 我
|   └── 你把
|       └── 他的是
└── ok
    └── yes
        └── right
```
