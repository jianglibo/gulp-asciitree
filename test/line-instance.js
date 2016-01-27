var chai = require('chai');
var through = require('through2');
var assert = require('assert');
var BytesLine = require('../lib/bytes-line');
var logmsg = require('./logmsg');

var expect = chai.expect;


// return

describe('InstanceType', function() {
    it("should right.", function(){
      var o = new BytesLine([],[]);
      var b = typeof o === 'object' && o instanceof BytesLine;
      assert(b, "should instanceof BytesLine");
    });
});
