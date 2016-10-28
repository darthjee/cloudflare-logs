(function(module){
  var _ = require("underscore");
  var CloudflareApi = require('./cloudflare_api')

  function Cloudflare(zoneId, authEmail, authKey) {
    this.api = new CloudflareApi(zoneId, authEmail, authKey);
  }

  var fn = Cloudflare.prototype;

  fn.fetch = function() {
    this.api.logs(function(json) {
       console.info(json);
    });
  };

  module.exports = Cloudflare;
})(module);
