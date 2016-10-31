(function(module){
  var _ = require("underscore"),
     CloudflareApi = require('./cloudflare_api'),
     Repeater = require('./repeater');

  function Cloudflare(zoneId, authEmail, authKey) {
    this.api = new CloudflareApi(zoneId, authEmail, authKey);
    this.loadSize = 100;

    _.bindAll(this, '_repeaterCallback');
    this.repeater = new Repeater(this._repeaterCallback, this, 5);
  }

  var fn = Cloudflare.prototype;

  fn.fetchAll = function() {
    this.repeater.call();
  };

  fn.fetch = function(callback) {
    this.api.logs({
      count: this.loadSize,
      start: this.startTime()
    }, {
      process: this._process,
      finish: this._finish
    });
  };

  fn._repeaterCallback = function(callback) {
    var that = this;

    this.fetch(function(count){
      callback(count >= that.loadSize / 2)
    });
  };

  fn._process = function(json) {
  };
  
  
  fn.finish = function(count) {
    callback.call(this, count);
  };

  fn.startTime = function() {
    return Math.floor((new Date().getTime() / 1000) - 3600)
  };

  module.exports = Cloudflare;
})(module);
