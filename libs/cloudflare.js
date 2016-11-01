(function(module) {
  var _ = require("underscore"),
      CloudflareApi = require('./cloudflare_api'),
      Log = require('./models/log'),
      Repeater = require('./repeater');
 
  function Cloudflare(config) {
    this.api = new CloudflareApi(config.zoneId, config.authEmail, config.authKey);
    this.loadSize = 1000;

    _.bindAll(this, 'fetch', '_finish', '_process');
    this.repeater = new Repeater(this.fetch, this, 50);
    this.logs = [];
  }

  var fn = Cloudflare.prototype;

  fn.fetchAll = function() {
    if (this.latest) {
      this.repeater.call();
    } else {
      this.initStartTime(this.repeater.call);
    }
  };

  fn.fetch = function() {
    this.api.logs({
      count: this.loadSize,
      start: this.latest
    }, {
      process: this._process,
      finish: this._finish
    });
  };

  fn._process = function(json) {
    this.logs.push(new Log(json).enrich());
  };
  
  fn._finish = function(count) {
    Log.insertBatch(this.logs);
    this.logs = [];
    this.latest = null;
    this.repeater.callback(count >= this.loadSize - 1)
  };

  fn.initStartTime = function(callback) {
    var that = this;

    Log.lastTimestamp(function(timestamp){
      timestamp = timestamp || that.startTime();
      that.latest = Math.ceil(timestamp / 1000000000);
      callback();
    });
  };

  fn.startTime = function() {
    return Math.floor((new Date().getTime() / 1000) - 3600 * 5)
  };

  module.exports = Cloudflare;
})(module);
