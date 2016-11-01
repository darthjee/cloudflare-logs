(function(module) {
  var _ = require("underscore"),
      CloudflareApi = require('./cloudflare_api'),
      Log = require('./models/log'),
      Repeater = require('./repeater');
 
  function Cloudflare(zoneId, authEmail, authKey) {
    this.api = new CloudflareApi(zoneId, authEmail, authKey);
    this.loadSize = 1;

    _.bindAll(this, 'fetch', '_finish', '_process');
    this.repeater = new Repeater(this.fetch, this, 5);
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
    this.latest = Math.ceil(json.timestamp / 1000000000);
    this.logs.push(new Log(json).enrich());
  };
  
  fn._finish = function(count) {
    Log.insertBatch(this.logs);
    this.logs = [];
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
    return Math.floor((new Date().getTime() / 1000) - 3600)
  };

  module.exports = Cloudflare;
})(module);
