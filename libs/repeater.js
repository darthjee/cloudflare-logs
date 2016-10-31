(function(module){
  var _ = require("underscore");

  function Repeater(func, subject, max){
    this.func = func;
    this.count = 0;
    this.max = max;
    this.subject = subject;

    _.bindAll(this, '_callback');
  }

  var fn = Repeater.prototype;

  fn.call = function() {
    this.count++;
    this.func.call(this.subject, this._callback);
  };

  fn._callback = function(repeat) {
    if(repeat && this.count < this.max) {
      this.call(); 
    }
  }

  module.exports = Repeater;
})(module);

