(function(module) {
  var _ = require("underscore"),
      CloudflareApi = require('./cloudflare/api'),
      Log = require('../models/log'),
      Repeater = require('../utils/repeater');
 
  function Cloudflare(config) {
    this.api = new CloudflareApi(config.zoneId, config.authEmail, config.authKey);
    this.loadSize = 1000;

    _.bindAll(this, 'fetch', '_finish', '_process', 'initStartTime');
    this.repeater = new Repeater(this.fetch, this, 100);
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
    if (this.latest) {
      this.api.logs({
        count: this.loadSize,
        start: this.latest
      }, {
        process: this._process,
        finish: this._finish
      });
    }
  };

  fn._process = function(json) {
    var log = new Log(json).enrich();
    this.logs.push(log);
  };
  
  fn._finish = function(count) {
    var that = this;

    Log.insertBatch(this.logs);
    this.logs = [];
    this.latest = null;

    console.info('Loaded: %s', count);
    this.initStartTime(function() {
      that.repeater.callback(count >= (that.loadSize / 2.0))
    });
  };

  fn.initStartTime = function(callback) {
    var that = this;

    Log.lastTimestamp(function(timestamp){
      timestamp = timestamp || that.startTime();
      that.latest = Math.ceil(timestamp / 1000000000);
      console.info(new Date(that.latest * 1000));
      callback();
    });
  };

  fn.startTime = function() {
    return Math.floor((new Date().getTime() / 1000) - 3600 * 24 * 2)
  };

  module.exports = Cloudflare;
})(module);
