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
          append;

      if (value.constructor == {}.constructor) {
        append = new Squasher(value, newKey).squash();
      } else {
        append = {};
        append[newKey] = value
      };

      _.extend(output, append);
    }

    return output;
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

