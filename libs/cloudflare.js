(function(module) {
  var _ = require("underscore"),
      CloudflareApi = require('./cloudflare_api'),
      Squasher = require('./squasher'),
      Log = require('./models/log'),
      Repeater = require('./repeater');
 
  function Cloudflare(zoneId, authEmail, authKey) {
    this.api = new CloudflareApi(zoneId, authEmail, authKey);
    this.loadSize = 1;

    _.bindAll(this, 'fetch', '_finish', '_process');
    this.repeater = new Repeater(this.fetch, this, 5);
    this.latest = this.startTime();
    this.logs = [];
  }

  var fn = Cloudflare.prototype;

  fn.fetchAll = function() {
    this.repeater.call();
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
    this.logs.push(Squasher.squash(json));
  };
  
  fn._finish = function(count) {
    Log.insertBatch(this.logs);
    this.logs = [];
    this.repeater.callback(count >= this.loadSize - 1)
  };

  fn.startTime = function() {
    return Math.floor((new Date().getTime() / 1000) - 3600)
  };

  module.exports = Cloudflare;
})(module);
