(function(module){
  var http = require('http');
  var _ = require("underscore");

  function Cloudflare(zoneId, authEmail, authKey) {
    this.zoneId = zoneId;
    this.authEmail = authEmail;
    this.authKey = authKey;
  }

  var fn = Cloudflare.prototype;

  fn.fetch = function() {
    http.get({
      hostname: 'api.cloudflare.com',
      path: '/client/v4/zones/' + this.zoneId + '/logs/requests' + this._params(),
      headers: this._headers()
    }, function(response){
    });
  };

  fn._params = function() {
    return '?count=100000&start=' + this.startTime();
  };

  fn.startTime = function() {
    return (new Date().getTime() / 1000) - 3600
  };

  fn._headers = function() {
    var headers = {};
    headers['Accept-Encoding'] = 'gzip';
    headers['X-Auth-Email'] = this.authEmail;
    headers['X-Auth-Key'] = this.authKey;

    return headers;
  };

  module.exports = Cloudflare;
})(module);
