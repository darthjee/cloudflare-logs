(function(module){
  var _ = require("underscore");

  function Squasher(input, prepend) {
    this.input = input;
    this.prepend = prepend || '';
  }

  var fn = Squasher.prototype;

  fn.squash = function() {
    if (this.output) {
      return this.output;
    } else {
      return this.output = this.buildOutput();
    }
  };

  fn.buildOutput = function() {
    var output = {};

    for (key in this.input) {
      var value = this.input[key],
          newKey = this.buildKey(key),
          append = this.squashValue(newKey, value);
      _.extend(output, append);
    }

    return output;
  };

  fn.squashValue = function(key, value) {
    var append = {}, that = this;

    if (value == null) {
      append[key] = value
    } else if (value.constructor == {}.constructor) {
      append = new Squasher(value, key).squash();
    } else {
      append[key] = value
    };

    return append;
  };

  fn.buildKey = function(key) {
    return (this.prepend + '_' + key).replace(/^_/, '')
  };

  module.exports = {
    squash: function(json) {
      return new Squasher(json).squash();
    }
  };
})(module);

