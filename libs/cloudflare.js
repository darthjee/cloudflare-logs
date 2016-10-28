(function(module){
  var _ = require("underscore");
  var CloudflareApi = require('./cloudflare_api')

  function Cloudflare(zoneId, authEmail, authKey) {
    this.api = new CloudflareApi(zoneId, authEmail, authKey);
  }

  var fn = Cloudflare.prototype;

  fn.fetch = function() {
    this.api.logs({
      count: 10000,
      start: this.startTime()
    }, function(json) {
       console.info(json);
    });
  };

  fn.startTime = function() {
    return Math.floor((new Date().getTime() / 1000) - 120)
  };

  module.exports = Cloudflare;
})(module);
