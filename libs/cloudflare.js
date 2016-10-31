(function(module){
  var _ = require("underscore"),
     CloudflareApi = require('./cloudflare_api'),
     Repeater = require('./repeater');

  function Cloudflare(zoneId, authEmail, authKey) {
    this.api = new CloudflareApi(zoneId, authEmail, authKey);
    this.loadSize = 100;

    _.bindAll(this, 'fetch', '_finish');
    this.repeater = new Repeater(this.fetch, this, 5);
  }

  var fn = Cloudflare.prototype;

  fn.fetchAll = function() {
    this.repeater.call();
  };

  fn.fetch = function() {
    this.api.logs({
      count: this.loadSize,
      start: this.startTime()
    }, {
      process: this._process,
      finish: this._finish
    });
  };

  fn._process = function(json) {
  };
  
  fn._finish = function(count) {
    console.info('count', count)
    this.repeater.callback(count >= this.loadSize / 2)
  };

  fn.startTime = function() {
    return Math.floor((new Date().getTime() / 1000) - 3600)
  };

  module.exports = Cloudflare;
})(module);
